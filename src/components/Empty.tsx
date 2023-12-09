import { Icons } from '@/assets';
import { SmallBody } from '@/components/Typography';
import styled from '@emotion/native';
import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

const Container = styled.View(({ theme: { colors, space } }) => ({
  flex: 1,
  backgroundColor: colors.black[2],
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: space[37],
}));
const Title = styled(SmallBody)(({ theme: { colors, space } }) => ({
  color: colors.grey[2],
  marginTop: space[1],
}));

interface IEmpty {
  style?: ViewStyle;
  text?: string;
  icon?: ReactNode;
}

const Empty = ({ style, text, icon }: IEmpty) => {
  return (
    <Container style={style}>
      {icon || <Icons.AppBlackLogo />}
      <Title>{text || 'Information does not exist'}</Title>
    </Container>
  );
};

export default Empty;
