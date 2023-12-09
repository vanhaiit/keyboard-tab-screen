import Avatar from '@/components/Avatar';
import Row from '@/components/Row';
import { H5, Label } from '@/components/Typography';
import VideoPlayer from '@/components/VideoPlayer';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { memo, useCallback, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import { HTMLContent } from '.';
import { IPost, PostContentType } from '../../types/Post';
import { convertPostData } from '../../utils';

const Container = styled.View(({ theme: { colors, horizontalSpace } }) => ({
  backgroundColor: colors.black[3],
  padding: horizontalSpace[2],
  borderRadius: 10,
  flexDirection: 'row',
  gap: horizontalSpace[3],
  flex: 1,
}));

const CustomImage = styled(FastImage)(() => ({
  width: '100%',
  height: '100%',
}));

const MediaContainer = styled.View(({ theme: { horizontalSpace, space } }) => ({
  borderRadius: 10,
  overflow: 'hidden',
  width: horizontalSpace[27],
  height: space[21],
}));

const RightContainer = styled(View)(({ theme: { space } }) => ({
  gap: space[2],
  alignItems: 'flex-start',
  flex: 1,
}));

const StyledRow = styled(Row)(({ theme: { space } }) => ({
  columnGap: space[2],
}));

interface Props {
  data: IPost;
  styleContainer?: ViewStyle;
}

const QuotePost = ({ data, styleContainer }: Props) => {
  const { horizontalSpace, space, colors } = useTheme();
  const { newMedias, shortContent } = convertPostData(data, 'Post');
  const renderData = useCallback(
    (attachments: { type: PostContentType; url: string }) => {
      return attachments.type === 'image' ? (
        <CustomImage
          key={attachments?.url}
          source={{
            uri: attachments?.url,
          }}
          resizeMode={'cover'}
        />
      ) : (
        <VideoPlayer
          height={space[21]}
          width={horizontalSpace[27]}
          url={attachments.url}
        />
      );
    },
    [horizontalSpace, space],
  );

  const createdTime = useMemo(() => {
    const timeDiff = dayjs().diff(dayjs(data.createdAt), 'days', true);
    if (timeDiff <= 2) {
      return dayjs(data.createdAt).fromNow(false);
    } else {
      return dayjs(data.createdAt).format('DD/MM/YYYY');
    }
  }, [data.createdAt]);

  return (
    <Container style={styleContainer}>
      {newMedias.length > 0 && (
        <MediaContainer>{renderData(newMedias[0])}</MediaContainer>
      )}
      <RightContainer>
        <StyledRow>
          <Avatar
            size={32}
            url={
              data.profile?.avatar?.url ||
              `${Config.BASE_URL}/uploads/profile-avatars/profile-avatar-${data.profile?.defaultAvatarIndex}.png`
            }
          />
          <View>
            <H5 numberOfLines={1} fontWeight="bold">
              {data.profile?.username}
            </H5>
            <Label color={colors.grey[1]} fontWeight="medium">
              {createdTime}
            </Label>
          </View>
        </StyledRow>
        <View>
          <Label numberOfLines={1} fontWeight="bold">
            {data.title}
          </Label>
          <HTMLContent
            numberOfLines={1}
            mode={'Trending'}
            html={shortContent || ''}
          />
        </View>
      </RightContainer>
    </Container>
  );
};

export default memo(QuotePost);
