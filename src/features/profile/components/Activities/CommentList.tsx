import styled from '@emotion/native';

import RenderHtml from 'react-native-render-html';
import { FlatList } from 'react-native';

import { H4, H5, Label } from '@/components/Typography';
import FastImage from 'react-native-fast-image';
import { IFetchComments } from '../../types';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import Empty from '@/components/Empty';
import { ActivityIndicator } from 'react-native';
import CommentListSkeleton from './CommentListSkeleton';
import { useNavigation } from '@react-navigation/native';
import { convertPostData } from '@/features/post/utils';
import Video from 'react-native-video';
import { fromNow } from '@/utils/formatDate';

const Container = styled.View(({ theme: { space } }) => ({
  flex: 1,
  paddingTop: space[2],
}));

const CardComment = styled.Pressable(({ theme: { space, colors } }) => ({
  paddingVertical: space[4],
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.whiteTransparent[1],
}));

const FastImageStyle = styled(FastImage)(
  ({ theme: { space, borderRadius, horizontalSpace } }) => ({
    width: space[10],
    height: space[10],
    borderRadius: borderRadius.full,
    marginRight: horizontalSpace[2],
  }),
);

const HeaderInfo = styled.Pressable(({ theme: {} }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
}));

const Info = styled.View(({ theme: { space } }) => ({
  marginLeft: space[1],
}));

const ReplyComment = styled.View(
  ({ theme: { colors, space, borderRadius } }) => ({
    backgroundColor: colors.black[2],
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderRadius: borderRadius.medium,
    marginTop: space[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }),
);

const Time = styled(Label)(({ theme: { colors, space } }) => ({
  color: colors.grey[1],
  marginTop: space[1],
}));

const ContentReply = styled(H5)(({ theme: { space } }) => ({
  marginTop: space[2],
}));

const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));

const ContentPostComment = styled.View(({ theme: {} }) => ({
  flex: 1,
}));

const MediaContent = styled.View(({ theme: { space } }) => ({
  marginRight: space[2],
  height: space[15],
}));

const ImageThumb = styled(FastImage)(
  ({ theme: { space, horizontalSpace, borderRadius } }) => ({
    width: horizontalSpace[25],
    height: space[15],
    borderRadius: borderRadius.small,
  }),
);

const VideoStyle = styled(Video)(
  ({ theme: { space, horizontalSpace, borderRadius } }) => ({
    height: space[15],
    width: horizontalSpace[25],
    borderRadius: borderRadius.small,
  }),
);

const Comment = ({ item }: { item: IFetchComments }) => {
  const { colors, window, space } = useTheme();
  const { navigate, push } = useNavigation<any>();
  const { newMedias } = convertPostData(item?.post, 'Post');

  const handleTag = (href: string) => {
    const arrSplit = href.split('/');
    const uniqueId = arrSplit[arrSplit.length - 1];
    push('ProfileDetail', { uniqueId });
  };

  const handleOnProfile = (id: string) => {
    push('ProfileDetail', { profileId: id });
  };

  return (
    <CardComment onPress={() => navigate('PostDetails', { post: item?.post })}>
      <HeaderInfo onPress={() => handleOnProfile(item?.owner?.id)}>
        <FastImageStyle
          source={
            item?.owner?.avatar?.url
              ? { uri: item?.owner?.avatar?.url }
              : require('@/assets/images/gray-logo.png')
          }
          resizeMode="contain"
        />

        <Info>
          <H4 fontWeight="bold">{item?.owner?.username}</H4>
          <Time fontWeight="medium" color={colors?.grey[1]}>
            {fromNow(new Date(item?.createdAt))}
          </Time>
        </Info>
      </HeaderInfo>
      <RenderHtml
        contentWidth={window.width * 0.8}
        source={{ html: item.content }}
        renderersProps={{
          a: {
            onPress: (_, href, attributes) => {
              handleTag(attributes?.href);
            },
          },
        }}
        tagsStyles={{
          a: {
            color: colors.lightGreen,
            textDecorationColor: colors.lightGreen,
          },
          p: {
            margin: 0,
            padding: 0,
            color: colors.white,
          },
        }}
        baseStyle={{
          color: colors.white,
          marginTop: space[2],
        }}
      />
      <ReplyComment>
        {newMedias && newMedias?.length > 0 && (
          <MediaContent>
            {newMedias[0]?.type === 'image' && (
              <ImageThumb
                key={newMedias[0]?.url}
                source={{
                  uri: newMedias[0]?.url,
                }}
                resizeMode={'cover'}
              />
            )}

            {newMedias[0]?.type === 'video' && (
              <VideoStyle source={{ uri: newMedias[0]?.url }} paused />
            )}
          </MediaContent>
        )}
        <ContentPostComment>
          <HeaderInfo onPress={() => handleOnProfile(item?.post?.profile?.id)}>
            <FastImageStyle
              source={
                item?.post?.profile?.avatar?.url
                  ? {
                      uri: item?.post?.profile?.avatar?.url,
                    }
                  : require('@/assets/images/gray-logo.png')
              }
              resizeMode="contain"
            />

            <Info>
              <H4 fontWeight="bold">{item?.post?.profile?.username}</H4>
              <Time>{fromNow(new Date(item?.post?.createdAt))}</Time>
            </Info>
          </HeaderInfo>
          <ContentReply fontWeight="bold" numberOfLines={2}>
            {item?.post?.title}
          </ContentReply>
        </ContentPostComment>
      </ReplyComment>
    </CardComment>
  );
};

interface ICommentList {
  data: IFetchComments[];
  isLoading: boolean;
  onLoadMore: () => void;
  loading: boolean;
}

const CommentList = ({
  data,
  isLoading,
  onLoadMore,
  loading,
}: ICommentList) => {
  const { space } = useTheme();

  const LoadingIcon = useMemo(() => {
    return (
      <>
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color="#ffff" />
          </LoadingContainer>
        ) : (
          <></>
        )}
      </>
    );
  }, [loading]);

  return (
    <Container>
      {isLoading ? (
        <CommentListSkeleton />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: space[6] }}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={_ => _.id.toString()}
          renderItem={({ item }) => <Comment item={item} />}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={LoadingIcon}
          ListEmptyComponent={<Empty style={{ flex: 0 }} />}
        />
      )}
    </Container>
  );
};

export default CommentList;
