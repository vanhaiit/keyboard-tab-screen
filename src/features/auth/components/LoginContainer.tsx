import { Icons } from '@/assets';
import Background from '@/assets/images/login-background.png';
import { Body, Label } from '@/components/Typography';

import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import React, { useCallback, useState } from 'react';
import { ImageBackground, Platform, View } from 'react-native';
import IconButton from './IconButton';
import { getStatusBarHeight } from '@/theme/helper';
import WalletConnectModal from './WalletConnectModal';
import useAuth from '../hooks/useAuth';

const BodyContent = styled.View(({ theme: { space, colors } }) => ({
  backgroundColor: colors.palette.whiteTransparent[1],
  marginTop: space[14],
  paddingHorizontal: space[4],
  paddingTop: space[10],
  paddingBottom: space[14],
}));

const CustomBackgroundImage = styled(ImageBackground)({
  flex: 1,
});

const TitleContainer = styled(View)(({ theme: { space } }) => ({
  alignItems: 'center',
  gap: space[4],
  paddingTop: space[23] - getStatusBarHeight(),
}));

const SubTitle = styled(Body)(({ theme: { colors, space } }) => ({
  alignItems: 'center',
  color: colors.palette.white,
  maxWidth: space[54],
  textAlign: 'center',
  lineHeight: space[6],
}));

const LoginTitle = styled(Body)(({ theme: { space } }) => ({
  marginBottom: space[8],
  textAlign: 'center',
}));

const ButtonsContainer = styled(View)(({ theme: { space } }) => ({
  gap: space[4],
}));

const BottomContainer = styled(View)(({ theme: { space } }) => ({
  alignSelf: 'center',
  position: 'absolute',
  bottom: space[6],
}));

const BottomDescription = styled(Label)(({ theme: { colors, space } }) => ({
  textAlign: 'center',
  maxWidth: space[59],
  color: colors.palette.black[1],
}));

interface Props {}

const LoginContainer: React.FC<Props> = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);
  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);

  const { space } = useTheme();

  const { handleSignInWithGoogle, handleSignInWithApple } = useAuth();

  return (
    <CustomBackgroundImage source={Background}>
      <TitleContainer>
        <Icons.AppLogo width={space[45]} height={space[12]} />
        <SubTitle fontWeight="medium">
          Start sharing your insights and earning!
        </SubTitle>
      </TitleContainer>
      <BodyContent>
        <LoginTitle fontWeight="medium">Login</LoginTitle>
        <ButtonsContainer>
          <IconButton
            onPress={handleSignInWithGoogle}
            icon={<Icons.GoogleLogo width={space[6]} height={space[6]} />}
            title="Continue with Google"
          />
          {Platform.OS === 'ios' && (
            <IconButton
              onPress={handleSignInWithApple}
              icon={<Icons.AppleLogo width={space[6]} height={space[6]} />}
              title="Continue with Apple"
            />
          )}

          <IconButton
            onPress={handleOpenModal}
            icon={<Icons.WalletIC width={space[6]} height={space[6]} />}
            title="Continue Wallet address"
          />
        </ButtonsContainer>
      </BodyContent>

      <BottomContainer>
        <BottomDescription>
          Copyright © {new Date().getFullYear()} Thinkin. All rights reserved.
        </BottomDescription>
      </BottomContainer>
      <WalletConnectModal isVisible={openModal} onClose={handleCloseModal} />
    </CustomBackgroundImage>
  );
};

export default LoginContainer;
