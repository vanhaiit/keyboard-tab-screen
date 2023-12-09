import Header from '@/components/Header';
import { ProfileCardItem } from '@/components/ProfileCardItem';
import { getUserInfo } from '@/features/auth/slice/selectors';
import ListCard from '@/features/post/components/MyFeed/ListCard';
import ListCardSkeleton from '@/features/post/components/MyFeed/ListCard/ListCardSkeleton';
import { useGetUserToFollowQuery } from '@/features/post/slice/api';
import { UserProfile } from '@/features/profile/types';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import { useAppSelector } from '@/store/type';
import styled from '@emotion/native';

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.black[4],
  flex: 1,
}));

const ContentContainer = styled.View(({ theme: { horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[4],
  flex: 1,
}));

const UserToFollow = () => {
  const userInfo = useAppSelector(getUserInfo);
  const { combinedData, isFetching, loadMore, isLoading } =
    useInfiniteQuery<UserProfile>({
      useGetDataListQuery: useGetUserToFollowQuery,
      params: {
        pageSize: 20,
        userId: userInfo?.profile?.id,
      },
    });

  return (
    <Container>
      <Header title="User to follow" hideHeaderLeft={false} />
      <ContentContainer>
        {isLoading ? (
          <ListCardSkeleton />
        ) : (
          <ListCard
            data={combinedData}
            onLoadMore={loadMore}
            loading={isFetching && !!combinedData}
            ItemComponent={ProfileCardItem}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

export default UserToFollow;
