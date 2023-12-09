import { H4 } from '@/components/Typography';
import { AppStackParams } from '@/navigations/types';
import { useAppDispatch, useAppSelector } from '@/store/type';
import styled from '@emotion/native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { getSearchHistory } from '../../slice/selectors';
import TagSearch from '../common/Tag';
import { removeSearchHistory } from '../../slice';

interface Props {
  onSearch: (value: string) => void;
}

const MAX_RECORD_RECENT_SEARCH_HISTORY = 5;

const SearchRecent: React.FC<Props> = ({ onSearch }) => {
  const searchHistory = useAppSelector(getSearchHistory);
  const { navigate } = useNavigation<NavigationProp<AppStackParams, 'Tab'>>();
  const dispatch = useAppDispatch();

  const renderSearchHistory = () => {
    const maxRecordRender = searchHistory.slice(
      0,
      MAX_RECORD_RECENT_SEARCH_HISTORY,
    );

    return maxRecordRender.map((item: string, i: number) => {
      return (
        <TagSearch
          key={i}
          tagValue={item}
          onPressTag={() => {
            onSearch(item);
            navigate('SearchDetail', { searchContent: item });
          }}
          onPressRemove={() => {
            dispatch(removeSearchHistory(item));
          }}
        />
      );
    });
  };

  return (
    <SearchRecentContainer>
      <Title fontWeight="bold">Recent</Title>
      <TagList>{renderSearchHistory()}</TagList>
    </SearchRecentContainer>
  );
};

export default SearchRecent;

const TagList = styled.View(() => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

const Title = styled(H4)(({ theme }) => ({
  color: theme.colors.grey[1],
}));

const SearchRecentContainer = styled.View(({ theme }) => ({
  paddingVertical: theme.space[4],
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.black[5],
  borderStyle: 'solid',
  zIndex: -1,
}));
