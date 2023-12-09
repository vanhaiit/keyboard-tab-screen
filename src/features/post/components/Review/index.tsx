import BottomSheet from '@/components/BottomSheet';
import CheckBox from '@/components/CheckBox';
import { H3, H4 } from '@/components/Typography';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import { baseQueryApi } from '@/store/baseQueryApi';
import { useAppDispatch } from '@/store/type';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useGetPostCategoriesQuery, useGetPostsQuery } from '../../slice/api';
import { DayOption } from '../../types';
import { IPost } from '../../types/Post';
import EmptyPostList from '../EmptyPostList';
import Post from '../Post';
import PostSkeleton from '../PostListSkeleton/PostSkeleton';
import ReviewHeader from './ReviewHeader';
import Trending from './Trending';

const Container = styled.View(({ theme: { space } }) => ({
  flex: 1,
  marginTop: space[1],
}));
const Separator = styled.View(({ theme: { space } }) => ({
  height: space[4],
}));

const PostBox = styled.View(({ theme: { horizontalSpace } }) => ({
  marginHorizontal: horizontalSpace[4],
}));

const FilterContainer = styled.View(({ theme: { space } }) => ({
  marginVertical: space[4],
}));

const ListContainer = styled.ScrollView(({ theme: { space } }) => ({
  maxHeight: space[66],
}));

const ItemBox = styled.View(({ theme: { space } }) => ({
  gap: space[4],
}));

const Divider = styled.View(({ theme: { space, colors } }) => ({
  width: '100%',
  height: 1,
  backgroundColor: colors.palette.whiteTransparent[1],
  marginVertical: space[6],
}));

const CustomTitle = styled(H3)(({ theme: { space } }) => ({
  marginBottom: space[6],
}));
const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));

const CustomWrapper = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CustomBox = styled.View(({ theme: { space } }) => ({
  gap: space[4],
  marginVertical: space[4],
}));

const EmptyListBox = styled.View(({ theme: { space } }) => ({
  height: space[50],
  marginBottom: space[4],
}));

enum SortOptions {
  Latest = 'Latest',
  Top = 'Top',
}

const convertFiltersData = (
  sort: SortOptions,
  category: string,
  topDuration: DayOption,
) => {
  const params = {} as {
    _sort: string;
    reviewCategories: string;
    _createdAt_gte?: number;
  };
  if (sort === SortOptions.Latest) {
    params._sort = 'createdAt:desc';
  } else {
    params._sort = 'topScore:desc';
    params._createdAt_gte = dayjs().subtract(topDuration, 'd').valueOf();
  }

  if (category) {
    params.reviewCategories = category;
  }
  return params;
};

enum DataTypes {
  TrendingType = 'trending',
  ReviewType = 'review-header',
  PostType = 'post',
}

interface FilterOptions {
  categoryId: string;
  sortBy: SortOptions;
}

const pageLimit = 10;
const trendingPostLimit = 4;

interface Props {
  bottomSheetOpen: boolean;
  onCloseBottomSheet: () => void;
}

const Review = ({ bottomSheetOpen, onCloseBottomSheet }: Props) => {
  const { space } = useTheme();
  const [open, setOpen] = useState(false);

  const listRef = useRef<FlashList<any>>(null);
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<FilterOptions>({
    categoryId: '',
    sortBy: SortOptions.Latest,
  });
  const [selectedTopFilter, setSelectedTopFilter] = useState<DayOption>(
    DayOption.week,
  );
  const { data: categories } = useGetPostCategoriesQuery({
    _sort: 'createdAt:ASC',
    _limit: -1,
    _start: 0,
  });
  const { data: trendingPosts, isLoading: trendingLoading } = useGetPostsQuery({
    _limit: trendingPostLimit,
    _sort: 'score:desc',
    _start: 0,
    type: 'review',
  });

  const {
    combinedData: reviewPosts,
    isLoading: reviewPostLoading,
    isFetching,
    refreshing,
    loadMore,
    refresh,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetPostsQuery,
    params: {
      _limit: pageLimit,
      type: 'review',
      ...convertFiltersData(
        filters.sortBy,
        filters.categoryId,
        selectedTopFilter,
      ),
    },
  });
  console.log('reviewPosts', reviewPosts.length);
  const [selectedOption, setSelectedOption] = useState<FilterOptions>({
    categoryId: '',
    sortBy: SortOptions.Latest,
  });

  const containerStyle = useMemo(
    () => ({
      gap: space[4],
    }),
    [space],
  );

  const loading = useMemo(() => {
    return reviewPostLoading || trendingLoading;
  }, [reviewPostLoading, trendingLoading]);

  const handleSubmitFilter = useCallback(() => {
    dispatch(baseQueryApi.util.resetApiState());
    refresh();
    setFilters(selectedOption);
    onCloseBottomSheet();
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0 });
    }
  }, [dispatch, refresh, selectedOption, onCloseBottomSheet]);

  const TopFilters = useCallback(() => {
    return (
      <CustomBox>
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
      </CustomBox>
    );
  }, [selectedTopFilter]);

  const Filters = useCallback(() => {
    return (
      <FilterContainer>
        <ItemBox>
          <CheckBox
            mode="radio"
            onPress={() =>
              setSelectedOption({
                ...selectedOption,
                sortBy: SortOptions.Latest,
              })
            }
            checked={selectedOption.sortBy === SortOptions.Latest}
            label="Latest"
          />
          <CustomWrapper>
            <CheckBox
              mode="radio"
              onPress={() => {
                setSelectedOption({
                  ...selectedOption,
                  sortBy: SortOptions.Top,
                });
                setOpen(true);
              }}
              checked={selectedOption.sortBy === SortOptions.Top}
              label="Top"
            />
            <H4 color="#8D8D8D">{selectedTopFilter} days</H4>
          </CustomWrapper>
        </ItemBox>
        <Divider />
        <CustomTitle fontWeight="bold">By Category</CustomTitle>
        <ListContainer contentContainerStyle={containerStyle}>
          <CheckBox
            mode="radio"
            onPress={() => {
              setSelectedOption({
                ...selectedOption,
                categoryId: '',
              });
            }}
            checked={selectedOption.categoryId === ''}
            label={'All'}
          />
          {categories?.length &&
            categories?.map(item => (
              <CheckBox
                mode="radio"
                key={item.id}
                onPress={() => {
                  setSelectedOption({
                    ...selectedOption,
                    categoryId: item.id,
                  });
                }}
                checked={selectedOption.categoryId === item.id}
                label={item.name}
              />
            ))}
        </ListContainer>
      </FilterContainer>
    );
  }, [selectedOption, selectedTopFilter, containerStyle, categories]);

  const LoadingIcon = useMemo(() => {
    return (
      <>
        {isFetching && !!reviewPosts ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color="#ffff" />
          </LoadingContainer>
        ) : (
          <></>
        )}
      </>
    );
  }, [isFetching, reviewPosts]);

  const posts = useMemo(() => {
    if (reviewPosts && reviewPosts.length > 0) {
      return reviewPosts;
    } else if (reviewPosts && reviewPosts.length <= 0) {
      return [{ id: 'empty' }];
    } else {
      return [{ id: null }, { id: null }];
    }
  }, [reviewPosts]) as IPost[];

  const handlePressCategoryFilter = (categoryId: string) => {
    setSelectedOption({
      ...filters,
      categoryId,
    });
    handleSubmitFilter();
  };

  return (
    <Container>
      <FlashList
        ref={listRef}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={LoadingIcon}
        ItemSeparatorComponent={() => <Separator />}
        estimatedItemSize={200}
        data={[
          {
            type: DataTypes.TrendingType,
            trendingData: trendingPosts || [],
            postData: null,
          },
          {
            type: DataTypes.ReviewType,
            postData: null,
            trendingData: null,
          },
          ...posts.map(item => {
            return {
              type: DataTypes.PostType,
              postData: item,
              trendingData: null,
            };
          }),
        ]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item: { type, postData, trendingData } }) => {
          if (type === DataTypes.TrendingType) {
            return <Trending loading={loading} data={trendingData || []} />;
          } else if (type === DataTypes.ReviewType) {
            return <ReviewHeader />;
          } else if (postData) {
            return (
              <PostBox>
                {reviewPostLoading || refreshing || postData.id === null ? (
                  <PostSkeleton mode="Post" />
                ) : postData.id === 'empty' ? (
                  <EmptyListBox>
                    <EmptyPostList />
                  </EmptyListBox>
                ) : (
                  <Post
                    key={index}
                    postData={postData}
                    onPressCategoryFilter={handlePressCategoryFilter}
                  />
                )}
              </PostBox>
            );
          }
          return <></>;
        }}
      />
      <BottomSheet
        onButtonPress={handleSubmitFilter}
        isVisible={bottomSheetOpen && !open}
        renderContent={Filters}
        title="By Post"
        closeModal={onCloseBottomSheet}
        buttonTitle="View Results"
        showDivider={false}
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

export default Review;
