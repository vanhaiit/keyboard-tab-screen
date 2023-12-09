import Header from '@/components/Header';
import useInfinitePageQuery from '@/hooks/useInfinitePageQuery';
import styled from '@emotion/native';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import EarnRewardCardItem from '../components/EarnRewardCardItem';
import { useGetEarnActionsQuery } from '../slice/api';
import { EarnActions } from '../types';
import { ActivityIndicator } from 'react-native';
import ListCardSkeleton from '@/features/post/components/MyFeed/ListCard/ListCardSkeleton';

const Separator = styled.View(({ theme: { space } }) => ({
  height: space[5],
}));
const Container = styled.View(({ theme: { colors } }) => ({
  flex: 1,
  backgroundColor: colors.black[3],
  width: '100%',
}));
const ListContainer = styled.View(({ theme: { space, window } }) => ({
  minHeight: window.height - space[15],
  flex: 1,
}));
const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));
const pageLimit = 10;

const RewardDetail = () => {
  const {
    combinedData: data,
    isFetching,
    isLoading,
    loadMore,
  } = useInfinitePageQuery({
    useGetDataListQuery: useGetEarnActionsQuery,
    params: {
      itemPerPage: pageLimit,
    },
  });
  const renderSeparator = useCallback(() => <Separator />, []);
  const keyExtractor = useCallback(
    (item: any, index: number) => item.id.toString() + index,
    [],
  );

  const containerStyles = useMemo(() => {
    return {
      paddingHorizontal: 16,
    };
  }, []);

  const LoadingIcon = useMemo(() => {
    return (
      <>
        {isFetching && !data ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color="#ffff" />
          </LoadingContainer>
        ) : (
          <></>
        )}
      </>
    );
  }, [isFetching, data]);

  return (
    <Container>
      <Header title="Reward Details" />
      <ListContainer>
        {isLoading ? (
          <ListCardSkeleton />
        ) : (
          <FlashList
            contentContainerStyle={containerStyles}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeparator}
            data={data as EarnActions[]}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => {
              return <EarnRewardCardItem data={item} />;
            }}
            estimatedItemSize={60}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={LoadingIcon}
          />
        )}
      </ListContainer>
    </Container>
  );
};

export default RewardDetail;
