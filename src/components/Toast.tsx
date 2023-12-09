import { Icons } from '@/assets';
import { colors } from '@/theme/colors';
import styled from '@emotion/native';
import ToastLib from 'react-native-toast-message';
import { Label, TinyLabel } from './Typography';
import { useTheme } from '@emotion/react';

const Left = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[4],
  height: horizontalSpace[4],
  marginRight: horizontalSpace[2],
}));

const Right = styled.View(() => ({}));

const Box = styled.View(({ theme: { horizontalSpace, space } }) => ({
  width: horizontalSpace[56],
  height: space[14],
  borderRadius: 10,
  borderWidth: 1,
  paddingLeft: horizontalSpace[4],
  paddingRight: horizontalSpace[4],
  paddingTop: space[3],
  paddingBottom: space[3],
  flexDirection: 'row',
}));

const TitleError = styled(Label)(({ theme: { colors: _colors } }) => ({
  color: _colors.alertRed,
}));

const TitleSuccess = styled(Label)(({ theme: { colors: _colors } }) => ({
  color: _colors.lightGreen,
}));

const Description = styled(TinyLabel)(({ theme: { colors: _colors } }) => ({
  color: _colors.white,
}));

const toastConfig = {
  _success: ({ text1, text2 }: any) => (
    <Box
      style={{
        borderColor: colors.lightGreen,
        backgroundColor: colors.darkGreen[7],
      }}>
      <Left>
        <Icons.CheckedToast />
      </Left>
      <Right>
        <TitleSuccess>{text1}</TitleSuccess>
        <Description>{text2}</Description>
      </Right>
    </Box>
  ),
  _error: ({ text1, text2 }: any) => (
    <Box
      style={{
        borderColor: colors.alertRed,
        backgroundColor: colors.black[7],
      }}>
      <Left>
        <Icons.ErrorToast />
      </Left>
      <Right>
        <TitleError>{text1}</TitleError>
        <Description>{text2}</Description>
      </Right>
    </Box>
  ),
};

export default function Toast() {
  const { space } = useTheme();
  return <ToastLib bottomOffset={space[25]} config={toastConfig} />;
}
