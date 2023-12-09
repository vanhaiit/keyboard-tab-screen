import { H3 } from '@/components/Typography';
import styled from '@emotion/native';
import FastImage from 'react-native-fast-image';

import { scale } from '@/theme/helper';

const Container = styled.View(({ theme: { colors, space, borderRadius } }) => ({
  backgroundColor: colors.black[2],
  borderRadius: borderRadius.medium,
  marginVertical: space[2],
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: space[4],
  flex: 1,
}));

const Title = styled(H3)(({ theme: { colors } }) => ({
  color: colors.grey[2],
  fontWeight: '600',
}));

const FastImageStyle = styled(FastImage)(({ theme: {} }) => ({
  width: scale(120),
  height: scale(120),
}));

const EmptyNFTList = () => {
  return (
    <Container>
      <FastImageStyle
        source={require('@/assets/images/bodyNFT.png')}
        resizeMode="contain"
      />
      <Title>You don't have any POPO NFT</Title>
    </Container>
  );
};

export default EmptyNFTList;
