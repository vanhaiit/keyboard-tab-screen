import { Body } from '@/components/Typography';
import styled from '@emotion/native';
import React from 'react';
import { SvgUri } from 'react-native-svg';

const Container = styled.TouchableOpacity(
  ({ theme: { colors, sizes, space } }) => ({
    width: '100%',
    backgroundColor: colors.palette.white,
    height: sizes[13],
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space[4],
  }),
);

const Image = styled(SvgUri)(({ theme: { sizes } }) => ({
  width: sizes[5],
  height: sizes[5],
}));

const Title = styled(Body)(({ theme: { colors } }) => ({
  color: colors.palette.black[2],
}));

interface Props {
  icon: JSX.Element;
  title: string;
  onPress?: () => void;
}

const IconButton: React.FC<Props> = ({ icon, title, onPress }) => {
  return (
    <Container onPress={onPress}>
      {icon}
      <Title fontWeight="medium">{title}</Title>
    </Container>
  );
};

export default IconButton;
