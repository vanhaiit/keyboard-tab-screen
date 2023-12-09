import { Icons } from '@/assets';
import { SmallBody } from '@/components/Typography';
import styled from '@emotion/native';
import { View } from 'react-native';

const Container = styled(View)(({ theme: { colors } }) => ({
  flex: 1,
  backgroundColor: colors.black[2],
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
}));
const Title = styled(SmallBody)(({ theme: { colors, space } }) => ({
  color: colors.grey[2],
  marginTop: space[1],
}));

const EmptyPostList = () => {
  return (
    <Container>
      <Icons.AppBlackLogo />
      <Title>Information does not exist</Title>
    </Container>
  );
};

export default EmptyPostList;
