import { Icons } from '@/assets';
import { H1 } from '@/components/Typography';
import CustomTabs from '@/features/nft/components/TabsBarCustom';
import { AppRootParams, AppStackParams } from '@/navigations/types';
import { theme } from '@/theme';
import styled from '@emotion/native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import get from 'lodash/get';
import { useCallback, useState } from 'react';
import RelatedDAO from '../components/SearchDetail/RelatedDAO';
import RelatedPosts from '../components/SearchDetail/RelatedPost';
import RelatedUsers from '../components/SearchDetail/RelatedUsers';
import TabAll from '../components/TabAll';
import { SafeAreaView } from 'react-native-safe-area-context';

export enum SearchTabsType {
  ALL = 1,
  POSTS = 2,
  DAOS = 3,
  USERS = 4,
}

const SearchDetail = () => {
  const [selectedTab, setSelectedTab] = useState<string | number>(
    SearchTabsType.ALL,
  );
  const handleTabChange = useCallback((value: number | string) => {
    setSelectedTab(value);
  }, []);
  const { params } = useRoute<RouteProp<AppRootParams>>();
  const searchContent = get(params, 'searchContent', '');
  const [searchValue, setSearchValue] = useState<string>(searchContent);

  const { goBack } = useNavigation<NavigationProp<AppStackParams>>();

  const handlePressSeeMore = (tabSwitch: SearchTabsType) => {
    setSelectedTab(tabSwitch);
  };

  const convertedSearchValue = searchValue?.toLowerCase();

  return (
    <SafeAreaViewContainer>
      <SearchDetailHeader>
        <TouchableBackIcon
          onPress={() => {
            goBack();
          }}>
          <Icons.BackArrow
            width={24}
            height={24}
            color={theme.colors.lightGreen}
          />
        </TouchableBackIcon>
        <SearchDetailTitle fontWeight="bold" numberOfLines={1}>
          {searchValue}
        </SearchDetailTitle>
      </SearchDetailHeader>
      <SearchDetailBody>
        <CustomTabs
          marginTop={theme.horizontalSpace[4]}
          tabActive={selectedTab}
          onChangeTab={handleTabChange}
          customStyle={{
            justifyContent: 'space-between',
          }}
          data={[
            {
              label: 'All',
              content: (
                <TabAll
                  searchContent={convertedSearchValue}
                  onPressSeeMore={handlePressSeeMore}
                  onPressTag={tagValue => {
                    setSearchValue(tagValue);
                  }}
                />
              ),
            },
            {
              label: 'Posts',
              content: (
                <RelatedPosts
                  searchContent={convertedSearchValue}
                  isSingleTab
                />
              ),
            },
            {
              label: 'DAOs',
              content: (
                <RelatedDAO searchContent={convertedSearchValue} isSingleTab />
              ),
            },
            {
              label: 'Users',
              content: (
                <RelatedUsers
                  searchContent={convertedSearchValue}
                  isSingleTab
                />
              ),
            },
          ]}
        />
      </SearchDetailBody>
    </SafeAreaViewContainer>
  );
};

export default SearchDetail;

const TouchableBackIcon = styled.TouchableOpacity(() => ({}));

const SearchDetailBody = styled.View(() => ({
  flex: 1,
}));

const SearchDetailTitle = styled(H1)(({ theme }) => ({
  color: theme.colors.white,
  marginLeft: theme.space[2],
}));

const SearchDetailHeader = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: theme.space[2],
}));

const SafeAreaViewContainer = styled(SafeAreaView)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.black[3],
  paddingVertical: theme.space[2],
  paddingHorizontal: theme.horizontalSpace[4],
}));
