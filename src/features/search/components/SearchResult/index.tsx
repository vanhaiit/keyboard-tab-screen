import { Icons } from '@/assets';
import { H4 } from '@/components/Typography';

import { AppRootParams } from '@/navigations/types';
import { useAppDispatch, useAppSelector } from '@/store/type';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getSearchHistory } from '../../slice/selectors';
import { removeSearchHistory, setSearchHistory } from '../../slice';
import { ISearchTags } from '../../types';

interface Props {
  searchInputRef: React.RefObject<TextInput>;
  searchValue: string;
  data: ISearchTags[];
  loadMore: () => void;
  isLoading: boolean;
}

const SearchResult: React.FC<Props> = ({
  searchInputRef,
  searchValue,
  data,
  loadMore,
  isLoading,
}) => {
  const dispatch = useAppDispatch();
  const searchHistory = useAppSelector(getSearchHistory);
  const { navigate } = useNavigation<NavigationProp<AppRootParams>>();
  const theme = useTheme();
  const dataRender = searchValue ? data : searchHistory;

  const renderItem = (data: { item: ISearchTags | string }) => {
    const value =
      searchValue && typeof data.item !== 'string'
        ? data?.item?.content
        : (data?.item as string);

    const handleOnPressResultItem = () => {
      navigate('SearchDetail', {
        searchContent: value,
      });
      dispatch(setSearchHistory(value));
    };

    const handleOnPressRemove = () => {
      dispatch(removeSearchHistory(value));
    };

    if (searchValue) {
      return (
        <TouchableOpacity onPress={handleOnPressResultItem}>
          <SearchResultItem>
            <SearchResultData>
              {(data?.item as ISearchTags).content}
            </SearchResultData>
          </SearchResultItem>
        </TouchableOpacity>
      );
    }

    return (
      <SearchResultItem>
        <TouchableOpacity onPress={handleOnPressResultItem} style={{ flex: 1 }}>
          <SearchResultData>{data?.item as string}</SearchResultData>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={10} onPress={handleOnPressRemove}>
          <Icons.Close width={16} height={16} color={theme.colors.grey[2]} />
        </TouchableOpacity>
      </SearchResultItem>
    );
  };

  const LoadingIcon = () => {
    return (
      <View>
        {isLoading ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color="#ffff" />
          </LoadingContainer>
        ) : (
          <></>
        )}
      </View>
    );
  };

  return (
    <OverlayScreen>
      {/* {isLoaded && <LoadingIcon />} */}
      <FlashList
        // contentContainerStyle={styles()}
        keyboardShouldPersistTaps={'handled'}
        onScroll={() => {
          if (searchInputRef) {
            searchInputRef?.current?.blur();
          }
        }}
        showsVerticalScrollIndicator={false}
        // ItemSeparatorComponent={renderSeparator}
        data={dataRender as ISearchTags[]}
        keyExtractor={(item: ISearchTags | string, index: number) => {
          if (searchValue) {
            return (item as ISearchTags)._id.toString() + index;
          }

          return item.toString() + index;
        }}
        renderItem={renderItem}
        estimatedItemSize={100}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={LoadingIcon}
        scrollEventThrottle={16}
      />
    </OverlayScreen>
  );
};

export default SearchResult;

const SearchResultItem = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.space[4],
  width: '100%',
  paddingHorizontal: theme.horizontalSpace[4],
}));

const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));

const SearchResultData = styled(H4)(({ theme }) => ({
  color: theme.colors.white,
}));

const OverlayScreen = styled.View(({ theme }) => ({
  position: 'absolute',
  // top: 80,
  top: 0,
  backgroundColor: theme.colors.black[3],
  left: -theme.horizontalSpace[4],
  width: theme.window.width,
  // minHeight: 200,
  // flex: 1,
  height: theme.window.height - theme.space[19],
  paddingBottom: theme.space[4],
}));
