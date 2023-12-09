import Avatar from '@/components/Avatar';
import Row from '@/components/Row';
import { H2, H5 } from '@/components/Typography';
import { DAO } from '@/features/profile/types';
import { AppRootParams } from '@/navigations/types';
import formatLargeNumber from '@/utils/formatLargeNumber';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

const Container = styled.View(({ theme: { space, horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[4],
  paddingVertical: space[4],
  gap: space[4],
}));

const Header = styled.View(({ theme: { horizontalSpace } }) => ({
  flexDirection: 'row',
  gap: horizontalSpace[3],
  alignItems: 'center',
}));

const Item = styled.View(({ theme: { horizontalSpace } }) => ({
  flexDirection: 'row',
  gap: horizontalSpace[1],
}));

const CustomRow = styled(Row)(({ theme: { horizontalSpace } }) => ({
  gap: horizontalSpace[4],
}));
const Wrapper = styled.View(() => ({
  flex: 1,
}));
const UserName = styled(H2)(() => ({
  width: '100%',
}));
interface Props {
  data: DAO;
}

const DaoItem = ({ data }: Props) => {
  const { horizontalSpace, colors } = useTheme();
  const { navigate } =
    useNavigation<NavigationProp<AppRootParams, 'Dashboard'>>();
  return (
    <Container>
      <Header>
        <Pressable
          onPress={() =>
            navigate('DetailDAO', {
              id: data.id,
            })
          }>
          <Avatar url={data.avatar?.url} size={horizontalSpace[15]} />
        </Pressable>
        <Wrapper>
          <UserName numberOfLines={1} fontWeight="bold">
            {data.name}
          </UserName>
          <CustomRow>
            <Item>
              <H5 color={colors.grey[1]}>Follower</H5>
              <H5>{formatLargeNumber(data.totalFollowers.toString(), 2)}</H5>
            </Item>
            <Item>
              <H5 color={colors.grey[1]}>Post</H5>
              <H5>{formatLargeNumber(data.totalPosts.toString(), 2)}</H5>
            </Item>
          </CustomRow>
        </Wrapper>
      </Header>
      <H5 numberOfLines={3}>{data.description}</H5>
    </Container>
  );
};

export default DaoItem;
