import { Icons } from '@/assets';
import BottomSheet from '@/components/BottomSheet';
import CheckBox from '@/components/CheckBox';
import { H5 } from '@/components/Typography';
import EmptyPostList from '@/features/post/components/EmptyPostList';
import PostSkeleton from '@/features/post/components/PostListSkeleton/PostSkeleton';
import { useGetLeadersEarnQuery } from '@/features/post/slice/api';
import { scale } from '@/theme/helper';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useGetMostFollowedQuery, useGetTopDaosQuery } from '../../slice/api';
import { FilterTypes, LeaderDaosFilters } from '../../types';
import LeaderItem from './ItemBox';

const Container = styled.View(() => ({
  flex: 1,
}));

const StyledButton = styled.TouchableOpacity(
  ({ theme: { colors, horizontalSpace, space } }) => ({
    flexDirection: 'row',
    gap: horizontalSpace[3],
    backgroundColor: colors.black[2],
    width: horizontalSpace[32],
    paddingHorizontal: horizontalSpace[2],
    paddingVertical: space[2],
    borderRadius: 10,
    justifyContent: 'space-between',
  }),
);

const IconBox = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[5],
  height: horizontalSpace[5],
}));

const HeaderContainer = styled.View(({ theme: { space } }) => ({
  marginBottom: space[4],
}));

const Separator = styled.View(({ theme: { space } }) => ({
  height: space[4],
}));
const FilterContainer = styled.View(({ theme: { space } }) => ({
  gap: 10,
  marginBottom: space[4],
}));
const SkeletonBox = styled.ScrollView(({ theme: { space } }) => ({
  gap: space[4],
}));
const EmptyContainer = styled(View)(({ theme: { window } }) => ({
  height: window.height - scale(200),
}));

export type LeaderBoardTypes = 'Earned' | 'Followed' | 'DAOs';

const renderFilterText = (
  type: LeaderBoardTypes,
  values: FilterTypes | LeaderDaosFilters,
) => {
  if (['Earned', 'Followed'].includes(type)) {
    switch (values) {
      case FilterTypes.Week:
        return 'This week';
      case FilterTypes.Month:
        return 'This month';
      default:
        return 'All time';
    }
  } else {
    switch (values) {
      case LeaderDaosFilters.MostMembers:
        return 'Most members';
      default:
        return 'Most post';
    }
  }
};

interface Props {
  type: LeaderBoardTypes;
}

const LeaderBoardList = ({ type }: Props) => {
  const { space } = useTheme();

  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{
    earned: FilterTypes;
    followed: FilterTypes;
    daos: LeaderDaosFilters;
  }>({
    earned: FilterTypes.Week,
    followed: FilterTypes.Week,
    daos: LeaderDaosFilters.MostPost,
  });

  const [filter, setFilter] = useState<{
    earned: FilterTypes;
    followed: FilterTypes;
    daos: LeaderDaosFilters;
  }>({
    earned: FilterTypes.Week,
    followed: FilterTypes.Week,
    daos: LeaderDaosFilters.MostPost,
  });

  const { data: leaders, isFetching: leadersLoading } = useGetLeadersEarnQuery(
    {
      _limit: 10,
      _start: 0,
      timeFilter:
        filter.earned === FilterTypes.AllTime ? undefined : filter.earned,
    },
    {
      skip: type !== 'Earned',
    },
  );

  const { data: mostFollowed, isFetching: mostFollowedLoading } =
    useGetMostFollowedQuery(
      {
        _limit: 10,
        _start: 0,
        timeFilter:
          filter.followed === FilterTypes.AllTime ? undefined : filter.followed,
      },
      {
        skip: type !== 'Followed',
      },
    );
  const { data: topDaos, isFetching: topDaosLoading } = useGetTopDaosQuery(
    {
      _limit: 10,
      _start: 0,
      filterTarget: filter.daos,
    },
    {
      skip: type !== 'DAOs',
    },
  );

  const handleCloseBottomSheet = useCallback(() => {
    setOpenBottomSheet(false);
  }, []);
  const handleSubmitFilter = useCallback(() => {
    setFilter(selectedOption);
    handleCloseBottomSheet();
  }, [handleCloseBottomSheet, selectedOption]);

  const handleOpenBottomSheet = useCallback(() => {
    setOpenBottomSheet(true);
  }, []);

  const renderHeader = useMemo(() => {
    const headerType =
      type === 'Earned'
        ? filter.earned
        : type === 'Followed'
        ? filter.followed
        : filter.daos;
    return (
      <HeaderContainer>
        <StyledButton onPress={handleOpenBottomSheet}>
          <H5 fontWeight="medium">{renderFilterText(type, headerType)}</H5>
          <IconBox>
            <Icons.ArrowDown />
          </IconBox>
        </StyledButton>
      </HeaderContainer>
    );
  }, [filter, handleOpenBottomSheet, type]);

  const separatorComponent = useCallback(() => {
    return <Separator />;
  }, []);

  const loading = useMemo(() => {
    return leadersLoading || mostFollowedLoading || topDaosLoading;
  }, [leadersLoading, mostFollowedLoading, topDaosLoading]);

  const data = useMemo(() => {
    switch (type) {
      case 'Earned':
        return leaders;
      case 'Followed':
        return mostFollowed;
      default:
        return topDaos;
    }
  }, [leaders, mostFollowed, topDaos, type]);

  const styles = useMemo(() => {
    return {
      paddingVertical: space[3],
    };
  }, [space]);
  const styles2 = useMemo(() => {
    return {
      gap: space[4],
    };
  }, [space]);

  enum DataType {
    Loading = 'Loading',
    Empty = 'empty',
  }
  const handleFilterChange = useCallback(
    (filterType: LeaderBoardTypes, value: any) => {
      if (filterType === 'Earned') {
        setSelectedOption({
          ...selectedOption,
          earned: value,
        });
      } else if (filterType === 'Followed') {
        setSelectedOption({
          ...selectedOption,
          followed: value,
        });
      } else {
        setSelectedOption({
          ...selectedOption,
          daos: value,
        });
      }
    },
    [selectedOption],
  );

  const Filters = useCallback(() => {
    return (
      <FilterContainer>
        {['Earned', 'Followed'].includes(type) && (
          <>
            <CheckBox
              mode="radio"
              onPress={() => handleFilterChange(type, FilterTypes.Week)}
              checked={
                type === 'Earned'
                  ? selectedOption.earned === FilterTypes.Week
                  : selectedOption.followed === FilterTypes.Week
              }
              label="This Week"
            />
            <CheckBox
              mode="radio"
              onPress={() => handleFilterChange(type, FilterTypes.Month)}
              checked={
                type === 'Earned'
                  ? selectedOption.earned === FilterTypes.Month
                  : selectedOption.followed === FilterTypes.Month
              }
              label="This Month"
            />
            <CheckBox
              mode="radio"
              onPress={() => handleFilterChange(type, FilterTypes.AllTime)}
              checked={
                type === 'Earned'
                  ? selectedOption.earned === FilterTypes.AllTime
                  : selectedOption.followed === FilterTypes.AllTime
              }
              label="All Time"
            />
          </>
        )}
        {type === 'DAOs' && (
          <>
            <CheckBox
              mode="radio"
              onPress={() =>
                handleFilterChange(type, LeaderDaosFilters.MostPost)
              }
              checked={selectedOption.daos === LeaderDaosFilters.MostPost}
              label="Most post"
            />
            <CheckBox
              mode="radio"
              onPress={() =>
                handleFilterChange(type, LeaderDaosFilters.MostMembers)
              }
              checked={selectedOption.daos === LeaderDaosFilters.MostMembers}
              label="Most members"
            />
          </>
        )}
      </FilterContainer>
    );
  }, [
    handleFilterChange,
    selectedOption.daos,
    selectedOption.earned,
    selectedOption.followed,
    type,
  ]);

  const renderData = useMemo(() => {
    if (loading) {
      return [
        {
          data: [null],
          type: DataType.Loading,
        },
      ];
    } else if (data && data.length === 0) {
      return [
        {
          data: [null],
          type: DataType.Empty,
        },
      ];
    } else {
      return data || [];
    }
  }, [DataType.Empty, DataType.Loading, data, loading]);

  return (
    <Container>
      <FlashList
        contentContainerStyle={styles}
        estimatedItemSize={200}
        ItemSeparatorComponent={separatorComponent}
        data={renderData as any}
        ListHeaderComponent={renderHeader}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const data = item as any;
          if (data.type === DataType.Loading) {
            return (
              <SkeletonBox contentContainerStyle={styles2}>
                <PostSkeleton mode="Post" />
                <PostSkeleton mode="Post" />
                <PostSkeleton mode="Post" />
                <PostSkeleton mode="Post" />
              </SkeletonBox>
            );
          } else if (data.type === DataType.Empty) {
            return (
              <EmptyContainer>
                <EmptyPostList />
              </EmptyContainer>
            );
          } else {
            return <LeaderItem type={type} data={data} position={index + 1} />;
          }
        }}
      />
      <BottomSheet
        onButtonPress={handleSubmitFilter}
        isVisible={openBottomSheet}
        renderContent={Filters}
        title="Sort By"
        closeModal={handleCloseBottomSheet}
        buttonTitle="View Results"
      />
    </Container>
  );
};

export default LeaderBoardList;
