import Header from '@/components/Header';
import DaoCardItem from '@/features/dao/components/DAO/DaoCardItem';
import ListCard from '@/features/post/components/MyFeed/ListCard';
import ListCardSkeleton from '@/features/post/components/MyFeed/ListCard/ListCardSkeleton';
import { useGetDaoToJoinQuery } from '@/features/post/slice/api';
import { UserProfile } from '@/features/profile/types';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import styled from '@emotion/native';

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.black[4],
  flex: 1,
}));

const ContentContainer = styled.View(({ theme: { horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[4],
  flex: 1,
}));

const DaoToJoin = () => {
  const { combinedData, isFetching, loadMore, isLoading } =
    useInfiniteQuery<UserProfile>({
      useGetDataListQuery: useGetDaoToJoinQuery,
      params: {
        _limit: 20,
      },
    });

  return (
    <Container>
      <Header title="DAO to join" hideHeaderLeft={false} />
      <ContentContainer>
        {isLoading ? (
          <ListCardSkeleton />
        ) : (
          <ListCard
            data={combinedData}
            onLoadMore={loadMore}
            loading={isFetching && !!combinedData}
            ItemComponent={DaoCardItem}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

export default DaoToJoin;
