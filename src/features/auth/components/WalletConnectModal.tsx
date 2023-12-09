import { View, Text, Pressable } from 'react-native';
import React from 'react';
import styled from '@emotion/native';
import WalletButton from './WalletButton';
import { Icons } from '@/assets';
import CustomModal from '@/components/Modal';
import { useTheme } from '@emotion/react';
import LinearGradient from 'react-native-linear-gradient';
import { H2 } from '@/components/Typography';
import useAuth from '../hooks/useAuth';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const CustomGradientBg = styled(LinearGradient)(
  ({ theme: { space, sizes } }) => ({
    height: space[17],
    borderTopLeftRadius: sizes[3],
    borderTopRightRadius: sizes[3],
    alignItems: 'center',
    justifyContent: 'center',
  }),
);

const HeaderText = styled(H2)(({ theme: { colors } }) => ({
  color: colors.palette.black[3],
  fontWeight: 'bold',
}));

const ModalHeader = () => {
  const theme = useTheme();
  return (
    <CustomGradientBg
      colors={[
        '#6D89F6',
        '#73ACD6',
        '#7BD5B2',
        '#7EE5A2',
        '#80F394',
        '#81F88F',
        '#9CF884',
        theme.colors.palette.lightGreen,
      ]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      locations={[0, 0.1, 0.22, 0.29, 0.38, 0.45, 0.64, 1]}>
      <HeaderText>Open Wallet</HeaderText>
    </CustomGradientBg>
  );
};

const BodyContainer = styled(View)(({ theme: { colors, space } }) => ({
  backgroundColor: colors.palette.white,
  height: space[46],
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: space[12],
  width: '100%',
}));

const WalletConnectModal = ({ isVisible, onClose }: Props) => {
  const { loading, handleConnectWallet, handleRetryConnectWallet } = useAuth();

  const renderModalBody = () => {
    return (
      <BodyContainer>
        {loading ? (
          <>
            <Text>Connecting...</Text>
            <Pressable onPress={handleRetryConnectWallet}>
              <Text>Retry</Text>
            </Pressable>
          </>
        ) : (
          <>
            <WalletButton
              onPress={() => handleConnectWallet('Metamask')}
              label="Metamask"
              icon={Icons.MetamaskIcon}
            />
            <WalletButton
              onPress={() => handleConnectWallet('Trust')}
              label="Trust Wallet"
              icon={require('@/assets/images/trustwallet.png')}
            />
          </>
        )}
      </BodyContainer>
    );
  };

  return (
    <CustomModal
      onBackdropPress={onClose}
      onClose={onClose}
      animationIn={'zoomInDown'}
      animationOut={'zoomOutUp'}
      isVisible={isVisible}
      headerContent={<ModalHeader />}
      bodyContent={renderModalBody()}
    />
  );
};

export default WalletConnectModal;
