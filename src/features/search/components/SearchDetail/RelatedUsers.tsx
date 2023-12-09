import { Icons } from '@/assets';
import Empty from '@/components/Empty';
import Loading from '@/components/Loading';
import { Label } from '@/components/Typography';
import useInfinitePageQuery from '@/hooks/useInfinitePageQuery';
import { theme } from '@/theme';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';
import { SearchTabsType } from '../../screen/SearchDetail';
import { useGetSearchUsersQuery } from '../../slice/api';
import { ISearchUsers } from '../../types';
import SearchEmpty from '../common/Empty';
import UserCard from '../common/UserCard';

const MAX_RECORD_RELATED_USERS = 4;

interface Props {
  searchContent: string;
  isSingleTab?: boolean;
  onPressSeeMore?: (tabValue: SearchTabsType) => void;
}

const RelatedUsers: React.FC<Props> = ({
  searchContent,
  onPressSeeMore,
  isSingleTab = false,
}) => {
  const { space } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: searchUsersData, isFetching } = useGetSearchUsersQuery(
    {
      page: 0,
      pageSize: MAX_RECORD_RELATED_USERS + 1, //for render see-more button
      text: searchContent,
    },
    {
      skip: !searchContent || isSingleTab,
    },
  );

  const {
    combinedData: searchUsersDataInfinite,
    isLoading: isLoadingUsersDataInfinite,
    loadMore,
    isFetching: isFetchingUsersDataInfinite,
  } = useInfinitePageQuery({
    useGetDataListQuery: useGetSearchUsersQuery,
    params: {
      text: searchContent,
      pageSize: MAX_RECORD_RELATED_USERS,
    },
    skip: !searchContent || !isSingleTab,
    defaultPage: 0,
  });

  const searchUsersDataList = searchUsersData || [];

  const searchUsersDataInfiniteList = searchUsersDataInfinite || [];

  const renderLoadingIcon = () => {
    if (isFetchingUsersDataInfinite) {
      return <Loading />;
    }

    return <></>;
  };

  const renderSeeMoreButton = () => {
    if (searchUsersDataList.length > MAX_RECORD_RELATED_USERS) {
      return (
        <SeeMoreTouchable
          onPress={() => {
            onPressSeeMore?.(SearchTabsType.USERS);
          }}>
          <Icons.PlusIc
            width={space[4]}
            height={space[4]}
            color={theme.colors.white}
          />
          <SeeMoreText fontWeight="bold">See more</SeeMoreText>
        </SeeMoreTouchable>
      );
    }
  };

  const renderUserList = () => {
    if (isFetching) {
      return <Loading />;
    }

    if (searchUsersDataList.length <= 0) {
      return <SearchEmpty />;
    }

    const renderUserItem = () => {
      const maxRecordRender = searchUsersDataList.slice(
        0,
        MAX_RECORD_RELATED_USERS,
      );

      return maxRecordRender.map((item: ISearchUsers, i) => {
        return <UserCard key={i} data={item} />;
      });
    };

    return <UserList>{renderUserItem()}</UserList>;
  };

  const renderUserListSingleTab = () => {
    if (
      searchUsersDataInfiniteList?.length <= 0 &&
      !isFetchingUsersDataInfinite &&
      !isLoadingUsersDataInfinite
    ) {
      return <Empty />;
    }

    return (
      <>
        {!isLoaded || renderLoadingIcon()}
        <ListContainer>
          <FlashList
            onLayout={() => setIsLoaded(true)}
            showsVerticalScrollIndicator={false}
            data={searchUsersDataInfiniteList as ISearchUsers[]}
            keyExtractor={(item: ISearchUsers) => item.id.toString()}
            renderItem={({ item }) => <UserCard key={item.id} data={item} />}
            estimatedItemSize={120}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderLoadingIcon()}
          />
        </ListContainer>
      </>
    );
  };

  return (
    <RelatedUsersContainer>
      {!isSingleTab ? (
        <>
          <TitleWrapper>
            <Title fontWeight="bold">Related Users</Title>
            {renderSeeMoreButton()}
          </TitleWrapper>
          <Content>{renderUserList()}</Content>
        </>
      ) : (
        renderUserListSingleTab()
      )}
    </RelatedUsersContainer>
  );
};

export default RelatedUsers;

const ListContainer = styled.View(({ theme }) => ({
  flex: 1,
}));

const UserList = styled.View(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: theme.space[2],
}));

const Content = styled.View(({ theme }) => ({}));

const SeeMoreText = styled(Label)(({ theme }) => ({
  marginLeft: theme.space[2],
}));

const SeeMoreTouchable = styled.TouchableOpacity(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

const Title = styled(Label)(({ theme }) => ({
  color: theme.colors.lightGreen,
}));

const TitleWrapper = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const RelatedUsersContainer = styled.View(({ theme }) => ({
  marginBottom: theme.space[2],
  flex: 1,
}));
