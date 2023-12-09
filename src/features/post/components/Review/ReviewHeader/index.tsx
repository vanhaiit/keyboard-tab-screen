import { Label } from '@/components/Typography';
import styled from '@emotion/native';
import { View } from 'react-native';

const Container = styled(View)(({ theme: { space } }) => ({
  marginLeft: space[4],
}));
const Title = styled(Label)(({ theme: { space, colors } }) => ({
  color: colors.lightGreen,
  marginTop: space[2],
}));

const ReviewHeader = () => {
  return (
    <Container>
      <Title fontWeight="bold">Review</Title>
    </Container>
  );
};

export default ReviewHeader;
