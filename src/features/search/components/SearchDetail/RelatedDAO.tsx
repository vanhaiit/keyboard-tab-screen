import { Icons } from '@/assets';
import Loading from '@/components/Loading';
import { Label } from '@/components/Typography';
import DaoCardItem from '@/features/dao/components/DAO/DaoCardItem';
import { theme } from '@/theme';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import { DAO } from '@/features/dao/types';
import { SearchTabsType } from '../../screen/SearchDetail';
import { useGetSearchDAOQuery } from '../../slice/api';
import SearchEmpty from '../common/Empty';
import Empty from '@/components/Empty';

const MAX_RECORD_DAO = 4;
interface Props {
  searchContent: string;
  isSingleTab?: boolean;
  onPressSeeMore?: (tabValue: SearchTabsType) => void;
}

const RelatedDAO: React.FC<Props> = ({
  searchContent,
  isSingleTab = false,
  onPressSeeMore,
}) => {
  const { space } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: searchDAOData, isFetching } = useGetSearchDAOQuery(
    {
      text: searchContent,
      _limit: MAX_RECORD_DAO + 1, //for render see-more button
    },
    {
      skip: !searchContent || isSingleTab,
    },
  );

  const {
    combinedData: searchDAODataInfinite,
    isLoading: isLoadingDAODataInfinite,
    loadMore,
    isFetching: isFetchingDAODataInfinite,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetSearchDAOQuery,
    params: {
      text: searchContent,
      _limit: MAX_RECORD_DAO,
    },
    skip: !searchContent || !isSingleTab,
  });

  const searchDAODataList = searchDAOData || [];

  const renderLoadingIcon = () => {
    if (isFetchingDAODataInfinite) {
      return <Loading />;
    }

    return <></>;
  };

  const renderSeeMoreButton = () => {
    if (searchDAODataList.length > MAX_RECORD_DAO) {
      return (
        <SeeMoreTouchable
          onPress={() => {
            onPressSeeMore?.(SearchTabsType.DAOS);
          }}>
          <Icons.PlusIc
            width={space[4]}
            height={space[4]}
            color={theme.colors.white}
            style={{}}
          />
          <SeeMoreText fontWeight="bold">See more</SeeMoreText>
        </SeeMoreTouchable>
      );
    }
  };

  const renderDAOList = () => {
    if (isFetching) {
      return <Loading />;
    }

    if (searchDAODataList.length <= 0) {
      return <SearchEmpty />;
    }

    const renderDAOItem = () => {
      if (searchDAODataList) {
        const maxRecordRender = searchDAODataList?.slice(0, MAX_RECORD_DAO);

        return maxRecordRender?.map((item, i) => {
          return <DaoCardItem key={i} item={item} />;
        });
      }
    };

    return <DAOList>{renderDAOItem()}</DAOList>;
  };

  const renderDAOListSingleTab = () => {
    if (
      searchDAODataInfinite?.length <= 0 &&
      !isLoadingDAODataInfinite &&
      !isFetchingDAODataInfinite
    ) {
      return <Empty />;
    }

    return (
      <>
        {!isLoaded && renderLoadingIcon()}
        <ListContainer>
          <FlashList
            onLayout={() => setIsLoaded(true)}
            showsVerticalScrollIndicator={false}
            data={searchDAODataInfinite as DAO[]}
            keyExtractor={(item: DAO) => item.id.toString()}
            renderItem={({ item }) => <DaoCardItem key={item.id} item={item} />}
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
    <DAOContainer>
      {!isSingleTab ? (
        <>
          <TitleWrapper>
            <Title fontWeight="bold">DAO</Title>
            {renderSeeMoreButton()}
          </TitleWrapper>
          <Content>{renderDAOList()}</Content>
        </>
      ) : (
        renderDAOListSingleTab()
      )}
    </DAOContainer>
  );
};

export default RelatedDAO;

const ListContainer = styled.View(() => ({
  flex: 1,
}));

const DAOList = styled.View(({ theme }) => ({
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

const TitleWrapper = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.space[2],
}));

const DAOContainer = styled.View(({ theme }) => ({
  marginBottom: theme.space[2],
  flex: 1,
}));
