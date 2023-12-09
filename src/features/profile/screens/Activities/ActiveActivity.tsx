import styled from '@emotion/native';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';

import { RouteProp, useRoute } from '@react-navigation/native';
import { AppRootParams } from '@/navigations/types';
import { ActivityScreen, IFetchComments } from '../../types';
import {
  useGetBookMarkedPostQuery,
  useGetDraftPostQuery,
  useGetFetchCommentsQuery,
  useGetFetchPostQuery,
  useGetLikedPostQuery,
} from '../../slice/api';
import PostList from '@/features/post/components/PostList';
import { IPost } from '@/features/post/types/Post';
import { baseQueryApi } from '@/store/baseQueryApi';
import { useAppDispatch } from '@/store/type';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import InviteActivity from '../../components/Activities/InviteActivity';
import EmptyPostList from '@/features/post/components/EmptyPostList';
import Toast from 'react-native-toast-message';
import CommentList from '../../components/Activities/CommentList';

export default function ActiveActivityScreen() {
  const { params } = useRoute<RouteProp<AppRootParams, 'ActiveActivity'>>();

  const dispatch = useAppDispatch();

  const profileId = params?.profileId || '';
  const active = params?.active || '';

  const [likesFormat, setLikesFormat] = useState<IPost[]>([]);
  const [bookmarkFormat, setBookmarkFormat] = useState<IPost[]>([]);
  const [listDraft, setListDraft] = useState<IPost[]>([]);

  const {
    combinedData: dataPost,
    isLoading: isLoadingPost,
    isFetching: isFetchingPost,
    refreshing,
    loadMore,
    refresh,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetFetchPostQuery,
    params: {
      _sort: 'createdAt:DESC',
      _limit: 10,
      profile: profileId,
      status: 'public',
    },
    skip: active !== ActivityScreen.POST,
  });

  const {
    combinedData: dataLikes,
    isLoading: isLoadingLikes,
    isFetching: isFetchingLikes,
    refreshing: isRefreshingLikes,
    loadMore: loadMoreLikes,
    refresh: refreshLikes,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetLikedPostQuery,
    params: {
      _sort: 'createdAt:desc',
      _limit: 10,
      profile: profileId,
    },
    skip: active !== ActivityScreen.LIKES,
  });

  const {
    combinedData: dataBookMark,
    isLoading: isLoadingBookMark,
    isFetching: isFetchingBookMark,
    refreshing: isRefreshingBookMark,
    loadMore: loadMoreBookMark,
    refresh: refreshBookMark,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetBookMarkedPostQuery,
    params: {
      _sort: 'createdAt:DESC',
      _limit: 10,
      owner: profileId,
    },
    skip: active !== ActivityScreen.BOOKMARK,
  });

  const {
    combinedData: dataDrafts,
    isLoading: isLoadingDrafts,
    isFetching: isFetchingDrafts,
    refreshing: isRefreshingDrafts,
    loadMore: loadMoreDrafts,
    refresh: refreshDrafts,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetDraftPostQuery,
    params: {
      _sort: 'createdAt:DESC',
      _limit: 10,
      profile: profileId,
    },
    skip: active !== ActivityScreen.DRAFTS,
    refetchOnMountOrArgChange: true,
  });

  const {
    combinedData: dataComments,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
    refreshing: isRefreshingComments,
    loadMore: loadMoreComments,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetFetchCommentsQuery,
    params: {
      _sort: 'createdAt:DESC',
      _limit: 10,
      owner: profileId,
      status: 'public',
    },
    skip: active !== ActivityScreen.COMMENTS,
  });

  useEffect(() => {
    const data = dataBookMark?.map((el: any) => ({
      ...el?.post,
      isBookmarked: true,
    }));
    setBookmarkFormat(data);
  }, [dataBookMark]);

  useEffect(() => {
    const data = dataLikes?.map((el: any) => ({
      ...el?.post,
      isLike: true,
      isDislike: false,
    }));
    setLikesFormat(data);
  }, [dataLikes]);

  useEffect(() => {
    setListDraft(dataDrafts as IPost[]);
    return () => {
      setListDraft([]);
    };
  }, [dataDrafts]);

  const handlePostDraft = (id: string) => {
    const newListDraft = listDraft?.filter((el: IPost) => el?.id !== id);
    setListDraft(newListDraft);
    Toast.show({
      type: '_success',
      text1: 'Success',
      text2: 'Post successfully',
      position: 'bottom',
    });
  };

  const resetData = () => {
    dispatch(baseQueryApi.util.resetApiState());
    refresh();
  };

  const resetDataLikes = () => {
    dispatch(baseQueryApi.util.resetApiState());
    refreshLikes();
  };

  const resetDataBookMark = () => {
    dispatch(baseQueryApi.util.resetApiState());
    refreshBookMark();
  };

  const resetDataDraft = () => {
    dispatch(baseQueryApi.util.resetApiState());
    refreshDrafts();
  };

  const renderContent = (active: ActivityScreen) => {
    switch (active) {
      case ActivityScreen.POST:
        return (
          <>
            {!isLoadingPost && dataPost?.length === 0 ? (
              <ContainerEmptyData>
                <EmptyPostList />
              </ContainerEmptyData>
            ) : (
              <PostList
                onDeletePost={resetData}
                data={dataPost as IPost[]}
                onLoadMore={loadMore}
                loading={isFetchingPost}
                isLoading={isLoadingPost || refreshing}
              />
            )}
          </>
        );
      case ActivityScreen.COMMENTS:
        return (
          <CommentList
            data={dataComments as IFetchComments[]}
            isLoading={isLoadingComments || isRefreshingComments}
            onLoadMore={loadMoreComments}
            loading={isFetchingComments}
          />
        );
      case ActivityScreen.LIKES:
        return (
          <>
            {!isLoadingLikes && likesFormat?.length === 0 ? (
              <ContainerEmptyData>
                <EmptyPostList />
              </ContainerEmptyData>
            ) : (
              <PostList
                onDeletePost={resetDataLikes}
                data={likesFormat as IPost[]}
                onLoadMore={loadMoreLikes}
                loading={isFetchingLikes}
                isLoading={isLoadingLikes || isRefreshingLikes}
              />
            )}
          </>
        );
      case ActivityScreen.BOOKMARK:
        return (
          <>
            {!isLoadingBookMark && bookmarkFormat?.length === 0 ? (
              <ContainerEmptyData>
                <EmptyPostList />
              </ContainerEmptyData>
            ) : (
              <PostList
                onDeletePost={resetDataBookMark}
                data={bookmarkFormat as IPost[]}
                onLoadMore={loadMoreBookMark}
                loading={isFetchingBookMark}
                isLoading={isLoadingBookMark || isRefreshingBookMark}
              />
            )}
          </>
        );
      case ActivityScreen.DRAFTS:
        return (
          <>
            {!isLoadingDrafts && listDraft?.length === 0 ? (
              <ContainerEmptyData>
                <EmptyPostList />
              </ContainerEmptyData>
            ) : (
              <PostList
                onDeletePost={resetDataDraft}
                data={listDraft as IPost[]}
                onLoadMore={loadMoreDrafts}
                isLoading={
                  isLoadingDrafts || isFetchingDrafts || isRefreshingDrafts
                }
                onPostDraft={handlePostDraft}
              />
            )}
          </>
        );
      case ActivityScreen.INVITE:
        return <InviteActivity />;
      default:
        return '';
    }
  };

  const renderTitle = (activeTitle: ActivityScreen) => {
    switch (activeTitle) {
      case ActivityScreen.POST:
        return 'Post';
      case ActivityScreen.COMMENTS:
        return 'Comments';
      case ActivityScreen.LIKES:
        return 'Likes';
      case ActivityScreen.BOOKMARK:
        return 'Bookmark';
      case ActivityScreen.DRAFTS:
        return 'Drafts';
      case ActivityScreen.INVITE:
        return 'Invite';
      default:
        return '';
    }
  };

  return (
    <Container>
      <Header title={renderTitle(active as ActivityScreen)} />
      <Body>{renderContent(active as ActivityScreen)}</Body>
    </Container>
  );
}

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.black[4],
  flex: 1,
}));

const Body = styled.View(({ theme }) => ({
  flex: 1,
  paddingHorizontal: theme.space[4],
}));

const ContainerEmptyData = styled.View(({ theme: { space } }) => ({
  height: space[40],
  marginTop: space[4],
}));
