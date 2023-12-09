import BottomSheet from '@/components/BottomSheet';
import CheckBox from '@/components/CheckBox';
import { ProfileCardItem } from '@/components/ProfileCardItem';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { DAO, UserProfile } from '@/features/profile/types';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import { baseQueryApi } from '@/store/baseQueryApi';
import { useAppDispatch, useAppSelector } from '@/store/type';
import styled from '@emotion/native';
import { useCallback, useState } from 'react';
import { useGetMyFeedsQuery } from '../../slice/api';
import { DayOption, MyFeedFilterTypes } from '../../types';
import { IPost } from '../../types/Post';
import DaoCardItem from '../../../dao/components/DAO/DaoCardItem';
import EmptyPostList from '../EmptyPostList';
import PostList from '../PostList';
import PostListSkeleton from '../PostListSkeleton';
import ListCard from './ListCard';
import ListCardSkeleton from './ListCard/ListCardSkeleton';
import { Text, View } from 'react-native';
import dayjs from 'dayjs';
import { H4 } from '@/components/Typography';

const Container = styled.View(
  ({ theme: { colors, space, horizontalSpace } }) => ({
    backgroundColor: colors.black[3],
    flex: 1,
    paddingTop: space[1],
    paddingHorizontal: horizontalSpace[4],
  }),
);

const Box = styled.View(({ theme: { space } }) => ({
  marginVertical: space[5],
  flex: 1,
}));

const FilterContainer = styled.View(({ theme: { space } }) => ({
  gap: 10,
  marginBottom: space[4],
}));

const CustomWrapper = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

interface Props {
  bottomSheetOpen: boolean;
  onCloseBottomSheet: () => void;
}

const pageLimit = 20;
const usePostListTypes = [
  MyFeedFilterTypes.Following,
  MyFeedFilterTypes.Latest,
  MyFeedFilterTypes.Top,
  MyFeedFilterTypes.Trending,
];
const MyFeed = ({ bottomSheetOpen, onCloseBottomSheet }: Props) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(getUserInfo);
  const [selectedOption, setSelectedOption] = useState<MyFeedFilterTypes>(
    MyFeedFilterTypes.Following,
  );
  const [selectedTopFilter, setSelectedTopFilter] = useState<DayOption>(
    DayOption.week,
  );
  const [filter, setFilter] = useState<MyFeedFilterTypes>(
    MyFeedFilterTypes.Following,
  );
  const {
    combinedData: data,
    isLoading,
    isFetching,
    refreshing,
    loadMore,
    refresh,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetMyFeedsQuery,
    params: {
      _limit: pageLimit,
      queryType: filter,
      userId: userInfo?.profile?.id,
      topOptions: selectedTopFilter,
    },
  });

  const resetData = () => {
    dispatch(baseQueryApi.util.resetApiState());
    refresh();
  };

  const handleSubmitFilter = () => {
    resetData();
    setFilter(selectedOption);
    onCloseBottomSheet();
  };

  const TopFilters = useCallback(() => {
    return (
      <FilterContainer>
        <CheckBox
          mode="radio"
          onPress={() => setSelectedTopFilter(DayOption.week)}
          checked={selectedTopFilter === DayOption.week}
          label="7 days"
        />
        <CheckBox
          mode="radio"
          onPress={() => setSelectedTopFilter(DayOption.month)}
          checked={selectedTopFilter === DayOption.month}
          label="30 days"
        />
      </FilterContainer>
    );
  }, [selectedTopFilter]);

  const Filters = useCallback(() => {
    return (
      <FilterContainer>
        <CheckBox
          mode="radio"
          onPress={() => setSelectedOption(MyFeedFilterTypes.Following)}
          checked={selectedOption === MyFeedFilterTypes.Following}
          label="Following"
        />
        <CustomWrapper>
          <CheckBox
            mode="radio"
            onPress={() => {
              setSelectedOption(MyFeedFilterTypes.Top);
              setOpen(true);
            }}
            checked={selectedOption === MyFeedFilterTypes.Top}
            label="Top"
          />
          <H4 color="#8D8D8D">{selectedTopFilter} days</H4>
        </CustomWrapper>
        <CheckBox
          mode="radio"
          onPress={() => setSelectedOption(MyFeedFilterTypes.User)}
          checked={selectedOption === MyFeedFilterTypes.User}
          label="User"
        />
        <CheckBox
          mode="radio"
          onPress={() => setSelectedOption(MyFeedFilterTypes.Dao)}
          checked={selectedOption === MyFeedFilterTypes.Dao}
          label="DAO"
        />
        <CheckBox
          mode="radio"
          onPress={() => setSelectedOption(MyFeedFilterTypes.Latest)}
          checked={selectedOption === MyFeedFilterTypes.Latest}
          label="Latest"
        />
        <CheckBox
          mode="radio"
          onPress={() => setSelectedOption(MyFeedFilterTypes.Trending)}
          checked={selectedOption === MyFeedFilterTypes.Trending}
          label="Trending"
        />
      </FilterContainer>
    );
  }, [selectedOption, selectedTopFilter]);

  const renderContent = () => {
    if (isLoading || refreshing) {
      if ([MyFeedFilterTypes.User, MyFeedFilterTypes.Dao].includes(filter)) {
        return <ListCardSkeleton />;
      }
      return <PostListSkeleton />;
    } else if (data && data.length === 0) {
      return (
        <Box>
          <EmptyPostList />
        </Box>
      );
    } else {
      if (usePostListTypes.includes(filter)) {
        return (
          <PostList
            onDeletePost={resetData}
            data={data as IPost[]}
            onLoadMore={loadMore}
            loading={isFetching && !!data}
          />
        );
      } else if (filter === MyFeedFilterTypes.User) {
        return (
          <ListCard
            data={data as UserProfile[]}
            onLoadMore={loadMore}
            loading={isFetching && !!data}
            ItemComponent={ProfileCardItem}
          />
        );
      } else {
        return (
          <ListCard
            data={data as DAO[]}
            onLoadMore={loadMore}
            loading={isFetching && !!data}
            ItemComponent={DaoCardItem}
          />
        );
      }
    }
  };

  return (
    <Container>
      {renderContent()}
      <BottomSheet
        onButtonPress={handleSubmitFilter}
        isVisible={bottomSheetOpen && !open}
        renderContent={Filters}
        title="Sort By"
        closeModal={() => {
          onCloseBottomSheet();
        }}
        buttonTitle="View Results"
      />
      <BottomSheet
        onButtonPress={() => {
          setOpen(false);
        }}
        isVisible={open}
        renderContent={TopFilters}
        title="Top"
        closeModal={() => {
          setOpen(false);
        }}
        buttonTitle="View Results"
      />
    </Container>
  );
};

export default MyFeed;
