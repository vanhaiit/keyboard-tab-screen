import styled from '@emotion/native';
import Loading from '@/components/Loading';
import { H4 } from '@/components/Typography';
import Post from '@/features/post/components/Post';
import PostSkeleton from '@/features/post/components/PostListSkeleton/PostSkeleton';
import { useGetPostsQuery } from '@/features/post/slice/api';
import { IPost } from '@/features/post/types/Post';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import { baseQueryApi } from '@/store/baseQueryApi';
import { FlashList } from '@shopify/flash-list';
import debounce from 'lodash/debounce';
import { useCallback, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import SearchHeader from '../components/Header';
import SearchRecent from '../components/Recent';
import SearchResult from '../components/SearchResult';
import { useGetTagsQuery } from '../slice/api';
import { ISearchTags, SearchDataType } from '../types';

const LIMIT_TAGS = 10;
const LIMIT_POST_TRENDING = 4;

const Search = () => {
  const [isFocusedSearchInput, setIsFocusedSearchInput] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const dispatch = useDispatch();

  const {
    combinedData: data,
    isFetching,
    loadMore,
    refresh,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetTagsQuery,
    params: {
      _sort: 'createdAt:DESC',
      _limit: LIMIT_TAGS,
      _q: debouncedValue,
    },
    skip: !debouncedValue,
  });

  const {
    combinedData: postData,
    isFetching: isFetchingPostData,
    isLoading: isLoadingPostData,
    loadMore: loadMorePostData,
    refreshing,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetPostsQuery,
    params: {
      _sort: 'topScore:desc',
      _limit: LIMIT_POST_TRENDING,
      type: 'everyone',
    },
  });

  const debounceFunc = (value: string) => {
    dispatch(baseQueryApi.util.resetApiState());
    refresh();
    setDebouncedValue(value);
  };

  const handleSearch = (value: string) => {
    handleDebounceSearchValue(value);
    setSearchValue(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebounceSearchValue = useCallback(
    debounce(debounceFunc, 300),
    [],
  );

  const dataSearch = [
    {
      type: SearchDataType.RECENT,
      postData: null,
    },
    {
      type: SearchDataType.TRENDING,
      postData: null,
    },
    ...(postData.map(item => {
      return {
        type: SearchDataType.POST,
        postData: item,
      };
    }) as any),
  ];

  const renderLoadingIcon = () => {
    if (isFetchingPostData) {
      return <Loading />;
    }

    return <></>;
  };

  const renderItemSearch = ({
    item: { type, postData },
    index,
  }: {
    item: { type: SearchDataType; postData: IPost | null };
    index: number;
  }) => {
    if (type === SearchDataType.RECENT) {
      return <SearchRecent onSearch={handleSearch} />;
    } else if (type === SearchDataType.TRENDING) {
      return <Title fontWeight="bold">Trending</Title>;
    } else if (postData) {
      return (
        <PostBox>
          {isLoadingPostData || refreshing ? (
            <PostSkeleton mode="Post" />
          ) : (
            <Post key={index} postData={postData as IPost} />
          )}
        </PostBox>
      );
    }
    return <></>;
  };

  return (
    <SafeAreaViewContainer>
      <SearchHeader
        searchInputRef={searchInputRef}
        isFocusedSearchInput={isFocusedSearchInput}
        setIsFocusedSearchInput={setIsFocusedSearchInput}
        searchValue={searchValue}
        onSearch={handleSearch}
      />
      <SearchBody>
        {isFocusedSearchInput && (
          <SearchResult
            searchValue={searchValue}
            data={data as ISearchTags[]}
            isLoading={isFetching}
            loadMore={loadMore}
            searchInputRef={searchInputRef}
          />
        )}
        <Container>
          <FlashList
            onEndReached={loadMorePostData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderLoadingIcon()}
            estimatedItemSize={200}
            data={dataSearch}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItemSearch}
          />
        </Container>
      </SearchBody>
    </SafeAreaViewContainer>
  );
};

export default Search;

const Title = styled(H4)(({ theme }) => ({
  color: theme.colors.white,
  marginTop: theme.space[4],
}));

const PostBox = styled.View(({ theme: { space } }) => ({
  marginVertical: space[2],
}));

const Container = styled.View(({ theme: { space } }) => ({
  flex: 1,
  marginTop: space[1],
  zIndex: -1,
}));

const SearchBody = styled.View(() => ({
  position: 'relative',
  flex: 1,
}));

const SafeAreaViewContainer = styled(SafeAreaView)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.black[3],
  paddingVertical: theme.space[2],
  paddingHorizontal: theme.horizontalSpace[4],
}));
