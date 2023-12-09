import styled from '@emotion/native';
import { H2, Label, H3 } from '@/components/Typography';
import Row from '@/components/Row';
import Stat from '@/components/Stat';
import CustomTabs from '../components/TabsBarCustom';
import NFTWrapper from '../components/NFTWrapper';
import {
  useFetchDecoratedPoposMutation,
  useGetAccessIDSQuery,
  useGetProFileByUniqueIDQuery,
  useGetWearableNFTQuery,
} from '../slice/api';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/store/type';

import {
  DecoratedPopos,
  FilterStatus,
  FilterType,
  WearableNFTResponse,
  WearableNfts,
} from '../types';
import FastImage from 'react-native-fast-image';
import { scale } from '@/theme/helper';
import BottomSheet from '@/components/BottomSheet';
import CheckBox from '@/components/CheckBox';
import Header from '@/components/Header';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { AppRootParams } from '@/navigations/types';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { useTheme } from '@emotion/react';

const countType = (data: DecoratedPopos[], type: string) => {
  const wearable_nfts = data?.map((el: any) => el?.wearable_nfts);
  const arr = [].concat(...wearable_nfts);
  const length = arr.filter(
    (item: WearableNfts) => item?.type === type,
  )?.length;
  return length;
};

const getAccetId = (data: DecoratedPopos[]) => {
  const wearable_nfts = data?.map((el: any) =>
    el?.wearable_nfts?.map((e: any) => el?.[e?.type]),
  );

  const formatArr = [].concat(...wearable_nfts);

  const arr = formatArr?.filter((el: any) => !!el);

  const assetIdArr = arr?.map((el: any) => el?.assetId);

  return assetIdArr;
};

interface INftScreen {
  hideBack?: boolean;
}

export default function NftScreen({ hideBack }: INftScreen) {
  const route = useRoute<RouteProp<AppRootParams, 'Nft'>>();
  const userInfo = useAppSelector(getUserInfo);

  const uniqueId =
    route?.params?.uniqueId || userInfo?.profile?.unique_id || '';

  const [type, setType] = useState({
    top: 0,
    bottom: 0,
    hair: 0,
    prop: 0,
  });

  const [dataWearable, setDataWearable] = useState<WearableNFTResponse[]>([]);
  const [dataWearableFilter, setDataWearableFilter] = useState<
    WearableNFTResponse[]
  >([]);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);

  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

  const [assetIdAttached, setAssetIdAttached] = useState<number[]>([]);

  const [filterAfter, setFilterAfter] = useState({
    status: FilterStatus.ALL,
    type: FilterType.ALL,
  });
  const [selectedTab, setSelectedTab] = useState<string | number>(1);

  const { space } = useTheme();

  const { data: profile } = useGetProFileByUniqueIDQuery(
    {
      _limit: 1,
      _sort: 'createdAt:desc',
      _start: 0,
      unique_id: uniqueId,
    },
    {
      skip: !uniqueId,
      refetchOnMountOrArgChange: true,
    },
  );

  const [fetchDecoratedPopos, { isLoading: isFetchDataLoading, data }] =
    useFetchDecoratedPoposMutation();

  const { data: assetId } = useGetAccessIDSQuery(
    { unique_id: uniqueId },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: dataWearableNft } = useGetWearableNFTQuery(
    {
      _limit: -1,
      _sort: 'createdAt:desc',
      _start: 0,
      assetId: assetId,
    },
    {
      skip: !assetId,
      refetchOnMountOrArgChange: true,
    },
  );

  useFocusEffect(
    useCallback(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    setType({
      top: countType(data, 'top'),
      bottom: countType(data, 'bottom'),
      hair: countType(data, 'hair_accessory'),
      prop: countType(data, 'prop_accessory'),
    });
    setAssetIdAttached(getAccetId(data));
  }, [data]);

  useEffect(() => {
    if (!dataWearableNft) return;
    const arr = dataWearableNft?.map((el: WearableNFTResponse) => {
      const newItem = { ...el };
      const findItem = assetIdAttached?.find((e: number) => e === el?.assetId);
      if (findItem) {
        newItem['attached'] = true;
      }
      return newItem;
    });
    setDataWearable(arr.sort((a, b) => b?.assetId - a?.assetId));
  }, [assetIdAttached, dataWearableNft]);

  const fetchData = async () => {
    try {
      await fetchDecoratedPopos({ unique_id: uniqueId || '' });
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleChangeStatus = useCallback(
    (status: FilterStatus) => {
      if (filterStatus === status) {
        setFilterStatus(FilterStatus.ALL);
      } else {
        setFilterStatus(status);
      }
    },
    [filterStatus],
  );

  const handleChangeType = useCallback(
    (status: FilterType) => {
      if (filterType === status) {
        setFilterType(FilterType.ALL);
      } else {
        setFilterType(status);
      }
    },
    [filterType],
  );

  const filterDataWearable = useCallback(
    (data: WearableNFTResponse[], status: FilterStatus, type: FilterType) => {
      let arr;

      if (status === FilterStatus.ATTACHED) {
        arr = data?.filter((el: WearableNFTResponse) =>
          assetIdAttached?.some((e: number) => el?.assetId === e),
        );
      } else if (status === FilterStatus.AVAILABLE) {
        arr = data?.filter(
          (el: WearableNFTResponse) =>
            !assetIdAttached?.some((e: number) => el?.assetId === e),
        );
      } else {
        arr = data;
      }

      if (type === FilterType?.TOP) {
        arr = arr?.filter((el: WearableNFTResponse) => el?.type === 'top');
      } else if (type === FilterType?.BOTTOM) {
        arr = arr?.filter((el: WearableNFTResponse) => el?.type === 'bottom');
      } else if (type === FilterType?.HAIR) {
        arr = arr?.filter(
          (el: WearableNFTResponse) => el?.type === 'hair_accessory',
        );
      } else if (type === FilterType?.PROP) {
        arr = arr?.filter(
          (el: WearableNFTResponse) => el?.type === 'prop_accessory',
        );
      } else {
        arr = arr;
      }
      setDataWearableFilter(arr?.sort((a, b) => b?.assetId - a?.assetId));
    },
    [assetIdAttached],
  );

  const handleFilter = () => {
    filterDataWearable(
      dataWearable as WearableNFTResponse[],
      filterStatus,
      filterType,
    );
    setFilterAfter({
      status: filterStatus,
      type: filterType,
    });
    setIsOpenFilter(false);
  };

  const handleCloseModal = () => {
    setIsOpenFilter(false);
    setFilterStatus(filterAfter?.status);
    setFilterType(filterAfter?.type);
  };

  const RenderFilterContent = useCallback(() => {
    return (
      <ContainerFilter>
        <TitleFilter fontWeight="bold">Attaching status</TitleFilter>
        <CheckBoxStyle
          onPress={() => handleChangeStatus(FilterStatus.ATTACHED)}
          label="Attached"
          checked={filterStatus === FilterStatus.ATTACHED}
          mode="radio"
        />
        <CheckBox
          onPress={() => handleChangeStatus(FilterStatus.AVAILABLE)}
          checked={filterStatus === FilterStatus.AVAILABLE}
          label="Available for attach"
          mode="radio"
        />
        <Divider />
        <TitleFilter fontWeight="bold">Wearable NFT type</TitleFilter>
        <CheckBoxStyle
          onPress={() => handleChangeType(FilterType.TOP)}
          checked={filterType === FilterType.TOP}
          label="Top"
          mode="radio"
        />
        <CheckBoxStyle
          onPress={() => handleChangeType(FilterType.BOTTOM)}
          checked={filterType === FilterType.BOTTOM}
          label="Bottom"
          mode="radio"
        />
        <CheckBoxStyle
          onPress={() => handleChangeType(FilterType.HAIR)}
          checked={filterType === FilterType.HAIR}
          label="Hair accessories"
          mode="radio"
        />
        <CheckBoxStyle
          onPress={() => handleChangeType(FilterType.PROP)}
          checked={filterType === FilterType.PROP}
          label="Prop accessories"
          mode="radio"
        />
      </ContainerFilter>
    );
  }, [filterStatus, filterType, handleChangeStatus, handleChangeType]);

  const handleTabChange = useCallback((value: number | string) => {
    setSelectedTab(value);
  }, []);

  const renderItem = () => {
    return (
      <>
        <ContentBox>
          <FastImageStyle
            source={require('@/assets/images/avatar-popo.png')}
            resizeMode="contain"
          />
          <BoxTotal>
            <TotalText>Total POPO</TotalText>
            <TotalCount>{data?.length || 0}</TotalCount>
          </BoxTotal>
        </ContentBox>
        <StatRow>
          <Stat value={type?.bottom} label="Top" />
          <Stat value={type?.bottom} label="Bottom" />
          <Stat value={type?.hair} label="Accessories 1" />
          <Stat value={type?.prop} label="Accessories 2" isLast />
        </StatRow>
      </>
    );
  };

  const styles = useMemo(() => {
    return {
      paddingHorizontal: space[4],
    };
  }, [space]);

  return (
    <Container>
      <Header
        title={
          uniqueId !== userInfo?.profile?.unique_id
            ? `${profile?.[0]?.username} NFT`
            : 'My NFT'
        }
        hideHeaderLeft={hideBack}
      />
      <Content
        contentContainerStyle={styles}
        data={[1]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={renderItem}
        renderItem={() => (
          <CustomTabs
            clickFilter={() => setIsOpenFilter(true)}
            tabActive={selectedTab}
            onChangeTab={handleTabChange}
            isFilter
            data={[
              {
                label: 'POPO',
                content: (
                  <NFTWrapper data={data} isLoading={isFetchDataLoading} />
                ),
              },
              {
                label: 'Wearable NFT',
                content: (
                  <NFTWrapper
                    data={
                      dataWearableFilter?.length > 0
                        ? dataWearableFilter
                        : dataWearable
                    }
                    isLoading={isFetchDataLoading}
                    isWearable
                  />
                ),
              },
            ]}
          />
        )}
      />
      <BottomSheet
        isVisible={isOpenFilter}
        title=""
        closeModal={handleCloseModal}
        renderContent={RenderFilterContent}
        buttonTitle="View results"
        onButtonPress={handleFilter}
        showDivider={false}
      />
    </Container>
  );
}

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.black[4],
  flex: 1,
}));

const Content = styled.FlatList(({ theme: {} }) => ({
  flex: 1,
}));

const ContentBox = styled.View(
  ({ theme: { space, colors, borderRadius } }) => ({
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.medium,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    marginTop: space[4],
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }),
);

const BoxTotal = styled.View(({ theme: { space } }) => ({
  marginLeft: space[4],
}));

const TotalText = styled(Label)({
  fontWeight: '500',
});

const TotalCount = styled(H2)({});

const StatRow = styled(Row)(({ theme: { space } }) => ({
  marginTop: space[4],
}));

const FastImageStyle = styled(FastImage)(({ theme: { borderRadius } }) => ({
  width: scale(60),
  height: scale(60),
  borderRadius: borderRadius.full,
}));

const ContainerFilter = styled.View(({ theme: {} }) => ({}));

const TitleFilter = styled(H3)(({ theme: { space } }) => ({
  marginBottom: space[4],
}));

const Divider = styled.View(({ theme: { space, colors } }) => ({
  width: '100%',
  height: 1,
  backgroundColor: colors.palette.whiteTransparent[1],
  marginVertical: space[4],
}));

const CheckBoxStyle = styled(CheckBox)(({ theme: { space } }) => ({
  marginBottom: space[4],
}));
