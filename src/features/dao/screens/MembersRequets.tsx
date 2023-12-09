import InputSearch from '@/features/following/components/InputSearch';
import { AppRootParams } from '@/navigations/types';
import styled from '@emotion/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import ListMembersRequest from '../components/DAO/ListMembersRequest';
import { useGetDaoReqQuery } from '../slice/api';
import { IUserDAO } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from '@/assets';
import { colors } from '@/theme/colors';
import { H1 } from '@/components/Typography';

const MemberRequests = () => {
  const route = useRoute<RouteProp<AppRootParams, 'MembersRequest'>>();

  const id = route?.params?.id;

  const navigation = useNavigation();

  const [dataMembers, setDataMembers] = useState<IUserDAO[]>([]);
  const [valueSearch, setValueSearch] = useState<string>('');

  const { data, isLoading } = useGetDaoReqQuery(
    {
      _sort: 'createdAt:desc',
      _limit: -1,
      _start: 0,
      status: 'pending',
      dao: id,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    setDataMembers(data || []);
  }, [data]);

  const onChangeSearch = (e: string) => {
    setValueSearch(e);
    const arrayFilter = data?.filter((el: IUserDAO) =>
      el?.profile?.username?.toLowerCase()?.includes(e.toLowerCase()),
    );
    setDataMembers(arrayFilter || []);
  };

  const handleCallBackAction = (value: string) => {
    const newData = dataMembers?.filter((el: IUserDAO) => el?.id !== value);
    setDataMembers(newData);
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BtnBack onPress={() => navigation.goBack()}>
            <Icons.ArrowLeft />
          </BtnBack>
          <H1 color={colors.white} fontWeight="bold">
            Members requests{' '}
            <H1 color={colors.lightGreen} fontWeight="bold">
              ({dataMembers?.length})
            </H1>
          </H1>
        </HeaderLeft>
      </Header>
      <Content>
        <InputSearch value={valueSearch} handleChange={onChangeSearch} />
        <ListMembersRequest
          data={dataMembers}
          isLoading={isLoading}
          callBackAction={handleCallBackAction}
        />
      </Content>
    </Container>
  );
};

export default MemberRequests;

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
