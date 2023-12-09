import { Icons } from '@/assets';
import { H5, getFontFamily } from '@/components/Typography';
import { theme } from '@/theme';
import styled from '@emotion/native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

import { AppStackParams } from '@/navigations/types';
import { setSearchHistory } from '../../slice';

interface Props {
  isFocusedSearchInput: boolean;
  setIsFocusedSearchInput: React.Dispatch<React.SetStateAction<boolean>>;
  searchInputRef: React.RefObject<TextInput>;
  searchValue: string;
  onSearch: (value: string) => void;
}

const SearchHeader: React.FC<Props> = ({
  isFocusedSearchInput,
  setIsFocusedSearchInput,
  searchInputRef,
  searchValue,
  onSearch,
}) => {
  const { goBack, canGoBack } = useNavigation();
  const dispatch = useDispatch();
  const { navigate } = useNavigation<NavigationProp<AppStackParams>>();

  const handlePressGoBack = () => {
    canGoBack() && goBack();
  };

  const renderBackIcon = () => {
    if (!isFocusedSearchInput) {
      return (
        <TouchableOpacity onPress={handlePressGoBack}>
          <Icons.BackArrow
            width={theme.space[5]}
            height={theme.space[5]}
            color={theme.colors.lightGreen}
          />
        </TouchableOpacity>
      );
    }
  };

  const renderSearchInput = () => {
    const renderCloseIcon = () => {
      if (searchValue) {
        const handlePressClear = () => {
          onSearch('');
        };

        return (
          <TouchableCloseIcon onPress={handlePressClear} hitSlop={10}>
            <CloseIconBackground>
              <Icons.Close width={8} height={8} color={theme.colors.black[2]} />
            </CloseIconBackground>
          </TouchableCloseIcon>
        );
      }
    };

    return (
      <SearchBox isFocusedSearchInput={isFocusedSearchInput}>
        <Icons.SearchIcon
          width={21}
          height={21}
          color={
            isFocusedSearchInput ? theme.colors.white : theme.colors.grey[1]
          }
        />
        <SearchInput
          ref={searchInputRef}
          placeholder="Search"
          placeholderTextColor={theme.colors.grey[1]}
          value={searchValue}
          focusable={isFocusedSearchInput}
          onFocus={() => {
            setIsFocusedSearchInput(true);
          }}
          onChangeText={onSearch}
          onSubmitEditing={() => {
            dispatch(setSearchHistory(searchValue));
            navigate('SearchDetail', { searchContent: searchValue });
          }}
        />
        {renderCloseIcon()}
      </SearchBox>
    );
  };

  const renderCancelButton = () => {
    if (isFocusedSearchInput) {
      const handlePressClear = () => {
        searchInputRef.current?.blur();
        setIsFocusedSearchInput(false);
        onSearch('');
      };

      return (
        <TouchableCloseIcon onPress={handlePressClear}>
          <CancelText>Cancel</CancelText>
        </TouchableCloseIcon>
      );
    }
  };

  return (
    <SearchHeaderContainer>
      {renderBackIcon()}
      {renderSearchInput()}
      {renderCancelButton()}
    </SearchHeaderContainer>
  );
};

export default SearchHeader;

const SearchHeaderContainer = styled.View(() => ({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: theme.space[2],
}));

const CancelText = styled(H5)(({ theme }) => ({
  color: theme.colors.lightGreen,
  marginLeft: theme.horizontalSpace[2],
  flex: 1,
  verticalAlign: 'middle',
}));

const TouchableCloseIcon = styled.TouchableOpacity(({ theme }) => ({
  paddingRight: theme.horizontalSpace[4],
}));

const CloseIconBackground = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.grey[1],
  borderRadius: theme.borderRadius.full,
  width: 14,
  height: 14,
  justifyContent: 'center',
  alignItems: 'center',
}));

const SearchBox = styled.View<{ isFocusedSearchInput: boolean }>(
  ({ theme, isFocusedSearchInput = false }) => ({
    backgroundColor: theme.colors.black[2],
    flex: 1,
    height: theme.scale(49),
    borderRadius: theme.borderRadius.medium,
    marginLeft: isFocusedSearchInput ? 0 : theme.horizontalSpace[2],
    paddingLeft: theme.horizontalSpace[4],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  }),
);

const SearchInput = styled.TextInput(({ theme }) => ({
  flex: 1,
  marginLeft: theme.horizontalSpace[2],
  marginRight: theme.horizontalSpace[4],
  color: theme.colors.white,
  fontSize: 15,
  fontFamily: getFontFamily('normal', false),
}));
