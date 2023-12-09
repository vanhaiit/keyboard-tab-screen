import styled from '@emotion/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppRootParams } from '@/navigations/types';
import InputSearch from '@/features/following/components/InputSearch';
import CustomTabs from '@/features/nft/components/TabsBarCustom';
import { useEffect, useMemo, useState } from 'react';
import { useGetUserDaosQuery } from '../slice/api';
import ListMembers from '../components/DAO/ListMembers';
import { IUserDAO, RoleDao } from '../types';
import { Icons } from '@/assets';
import { H1 } from '@/components/Typography';
import { colors } from '@/theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { useAppSelector } from '@/store/type';

const Members = () => {
  const route = useRoute<RouteProp<AppRootParams, 'Members'>>();
  const { id } = route?.params;

  const navigation = useNavigation();

  const { profile } = useAppSelector(getUserInfo)!;

  const [activeTab, setActiveTab] = useState<number | string>(1);
  const [dataAll, setDataAll] = useState<IUserDAO[]>([]);
  const [dataBLState, setBLState] = useState<IUserDAO[]>([]);
  const [search, setSearch] = useState<string>('');

  const { data, isLoading } = useGetUserDaosQuery({
    _sort: 'createdAt:ASC',
    _limit: -1,
    _start: 0,
    dao: id,
    status: 'public',
  });

  const { data: dataBlackList, isLoading: isLoadingBL } = useGetUserDaosQuery({
    _sort: 'createdAt:ASC',
    _limit: -1,
    _start: 0,
    dao: id,
    status: 'blocked',
  });

  const currentUserRole = useMemo(() => {
    const currentUser = data?.find(
      (el: IUserDAO) => el?.profile?.id === profile?.id,
    );
    return currentUser?.role;
  }, [data, profile?.id]);

  useEffect(() => {
    if (!data) return;
    setDataAll([...data]);
  }, [data]);

  useEffect(() => {
    if (!dataBlackList) return;
    setBLState(dataBlackList);
  }, [dataBlackList]);

  const dataContrib = useMemo(() => {
    return dataAll?.filter((el: IUserDAO) => el?.role === RoleDao.CONTRIBUTOR);
  }, [dataAll]);

  const handleChangeTab = (e: number | string) => {
    setActiveTab(e);
    setSearch('');
  };

  useEffect(() => {
    if (activeTab === 1) {
      const newArray = data?.filter((el: IUserDAO) =>
        el?.profile?.username?.toLowerCase().includes(search.toLowerCase()),
      );
      setDataAll(newArray || []);
    }
    if (activeTab === 2) {
      const newArray = data?.filter(
        (el: IUserDAO) =>
          el?.role === RoleDao.CONTRIBUTOR &&
          el?.profile?.username?.toLowerCase().includes(search.toLowerCase()),
      );
      setDataAll(newArray || []);
    }
    if (activeTab === 3) {
      const newArray = dataBlackList?.filter((el: IUserDAO) =>
        el?.profile?.username?.toLowerCase().includes(search.toLowerCase()),
      );
      setBLState(newArray || []);
    }
  }, [search, activeTab, data, dataBlackList]);

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BtnBack onPress={() => navigation.goBack()}>
            <Icons.ArrowLeft />
          </BtnBack>
          <H1 color={colors.white} fontWeight="bold">
            Members{' '}
            <H1 color={colors.lightGreen} fontWeight="bold">
              ({data?.length})
            </H1>
          </H1>
        </HeaderLeft>
      </Header>
      <Content>
        <InputSearch
          value={search}
          handleChange={(e: string) => setSearch(e)}
        />
        <CustomTabs
          tabActive={activeTab}
          onChangeTab={handleChangeTab}
          data={[
            {
              label: 'All',
              content: (
                <ListMembers
                  data={dataAll}
                  isLoading={isLoading}
                  idDao={id}
                  roleCurrentUser={currentUserRole!}
                />
              ),
            },
            {
              label: 'Contributors',
              content: (
                <ListMembers
                  data={dataContrib}
                  isLoading={isLoading}
                  idDao={id}
                  roleCurrentUser={currentUserRole!}
                />
              ),
            },
            {
              label: 'Blacklist',
              content: (
                <ListMembers
                  data={dataBLState || []}
                  isLoading={isLoadingBL}
                  idDao={id}
                  roleCurrentUser={currentUserRole!}
                />
              ),
            },
          ]}
        />
      </Content>
    </Container>
  );
};

export default Members;

const Container = styled(SafeAreaView)(({ theme: { colors } }) => ({
  backgroundColor: colors.black[3],
  flex: 1,
}));

const Content = styled.View(({ theme: { horizontalSpace } }) => ({
  flex: 1,
  marginHorizontal: horizontalSpace[4],
}));

const BtnBack = styled.TouchableOpacity(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[7],
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Header = styled.View(({ theme: { space, horizontalSpace } }) => ({
  height: space[10],
  paddingLeft: horizontalSpace[4],
  paddingRight: horizontalSpace[4],
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const HeaderLeft = styled.View({
  height: '100%',
  flexDirection: 'row',
  alignItems: 'center',
});
