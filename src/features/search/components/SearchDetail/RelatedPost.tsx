import { Icons } from '@/assets';
import Empty from '@/components/Empty';
import Loading from '@/components/Loading';
import { Label } from '@/components/Typography';
import Post from '@/features/post/components/Post';
import PostList from '@/features/post/components/PostList';
import { IPost } from '@/features/post/types/Post';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import { theme } from '@/theme';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import React from 'react';
import { SearchTabsType } from '../../screen/SearchDetail';
import { useGetSearchPostQuery } from '../../slice/api';
import SearchEmpty from '../common/Empty';

const MAX_RECORD_RELATED_POST = 4;

interface Props {
  searchContent: string;
  isSingleTab?: boolean;
  onPressSeeMore?: (tabValue: SearchTabsType) => void;
}

const RelatedPosts: React.FC<Props> = ({
  searchContent,
  isSingleTab = false,
  onPressSeeMore,
}) => {
  const { space } = useTheme();
  const { data: searchPostData, isFetching } = useGetSearchPostQuery(
    {
      text: searchContent,
      _limit: MAX_RECORD_RELATED_POST + 1, //for render see-more button
    },
    {
      skip: !searchContent || isSingleTab,
    },
  );

  const {
    combinedData: searchPostDataInfinite,
    isLoading: isLoadingPostDataInfinite,
    loadMore,
    isFetching: isFetchingPostDataInfinite,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetSearchPostQuery,
    params: {
      text: searchContent,
      _limit: MAX_RECORD_RELATED_POST,
    },
    skip: !searchContent || !isSingleTab,
  });

  const searchPostDataList = searchPostData || [];

  const renderSeeMoreButton = () => {
    if (searchPostDataList.length > MAX_RECORD_RELATED_POST) {
      return (
        <SeeMoreTouchable
          onPress={() => {
            onPressSeeMore?.(SearchTabsType.POSTS);
          }}>
          <Icons.PlusIc
            width={space[4]}
            height={space[4]}
            color={theme.colors.white}
            style={{}}
          />
          <SeeMoreText fontWeight="bold">See more</SeeMoreText>
        </SeeMoreTouchable>
      );
    }
  };

  const renderPostList = () => {
    if (isFetching) {
      return <Loading />;
    }

    if (searchPostDataList.length <= 0) {
      return <SearchEmpty />;
    }

    const renderPostItem = () => {
      const maxRecordRender = searchPostDataList.slice(
        0,
        MAX_RECORD_RELATED_POST + 1,
      );

      return maxRecordRender?.map((item, i) => {
        return (
          <Post key={i} postData={item} style={{ marginBottom: space[4] }} />
        );
      });
    };

    return <PostListContainer>{renderPostItem()}</PostListContainer>;
  };

  const renderPostListSingleTab = () => {
    if (
      (searchPostDataInfinite as IPost[])?.length <= 0 &&
      !isFetchingPostDataInfinite
    ) {
      return <Empty />;
    }

    return (
      <PostList
        data={searchPostDataInfinite as IPost[]}
        onLoadMore={loadMore}
        loading={isLoadingPostDataInfinite && !!searchPostDataInfinite}
      />
    );
  };

  return (
    <RelatedPostsContainer>
      {!isSingleTab ? (
        <>
          <TitleWrapper>
            <Title fontWeight="bold">Related Posts</Title>
            {renderSeeMoreButton()}
          </TitleWrapper>
          <Content>{renderPostList()}</Content>
        </>
      ) : (
        renderPostListSingleTab()
      )}
    </RelatedPostsContainer>
  );
};

export default RelatedPosts;

const PostListContainer = styled.View(({ theme }) => ({
  marginTop: theme.space[2],
}));

const Content = styled.View(({ theme }) => ({}));

const SeeMoreText = styled(Label)(({ theme }) => ({
  marginLeft: theme.space[2],
}));

const SeeMoreTouchable = styled.TouchableOpacity(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

const Title = styled(Label)(({ theme }) => ({
  color: theme.colors.lightGreen,
}));

const TitleWrapper = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.space[2],
}));

const RelatedPostsContainer = styled.View(({ theme }) => ({
  marginBottom: theme.space[2],
  flex: 1,
}));
