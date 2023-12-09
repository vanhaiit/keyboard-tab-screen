import { Icons } from '@/assets';
import Collapse from '@/components/Collapse';
import { H1, H4 } from '@/components/Typography';
import styled from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IDAODetail, IList } from '../types';

export default function Rule({ route }: any) {
  const navigation = useNavigation() as any;
  const list = route?.params?.data?.rule?.list as IList[];
  const detail = route?.params?.data as IDAODetail;
  return (
    <SafeAreaViewContainer>
      <Header>
        <HeaderLeft>
          <BtnBack onPress={() => navigation.goBack()}>
            <Icons.ArrowLeft />
          </BtnBack>
          <Title fontWeight="bold">Rules</Title>
        </HeaderLeft>
      </Header>

      <Container>
        {list?.length > 0 &&
          list.map((e, index) => (
            <Collapse key={index} title={e.title!} description={e.detail!} />
          ))}
        <BtnEdit
          onPress={() => {
            navigation.navigate('CreateDAO', { data: detail, tab: 2 });
          }}>
          <TextBtn>Modify Rules</TextBtn>
        </BtnEdit>
      </Container>
    </SafeAreaViewContainer>
  );
}

const TextBtn = styled(H4)(({ theme: { colors } }) => ({
  color: colors.white,
}));

const BtnEdit = styled.Pressable(
  ({ theme: { space, horizontalSpace, borderRadius, colors } }) => ({
    width: horizontalSpace[30],
    height: space[6],
    backgroundColor: colors.grey[1],
    borderRadius: borderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
  }),
);

const Title = styled(H1)({
  color: 'white',
});

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

const SafeAreaViewContainer = styled(SafeAreaView)(({ theme: { colors } }) => ({
  backgroundColor: colors.black[3],
}));

const Container = styled.View(({ theme: { colors, horizontalSpace } }) => ({
  display: 'flex',
  backgroundColor: colors.black[3],
  height: '100%',
  padding: horizontalSpace[4],
}));
