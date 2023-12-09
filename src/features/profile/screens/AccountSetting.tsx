import { Platform, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import Header from '@/components/Header';
import TextField from '@/components/TextField';
import styled from '@emotion/native';

import { H4, H5 } from '@/components/Typography';
import Button from '@/components/Button';

import WalletConnectModal from '@/features/auth/components/WalletConnectModal';
import { useAppSelector } from '@/store/type';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { useGetProfileInfoQuery, useUpdateProfileMutation } from '../slice/api';
import { formatEllipsisMiddle } from '@/utils';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const Container = styled.KeyboardAvoidingView(({ theme: { space } }) => ({
  flex: 1,
  paddingHorizontal: space[4],
  paddingBottom: space[5],
}));

const ConnectWalletButton = styled.TouchableOpacity(
  ({ theme: { space, colors, borderRadius } }) => ({
    height: space[10],
    borderRadius: borderRadius.medium,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space[3],
  }),
);

const ButtonSave = styled(Button)(({ theme: { borderRadius } }) => ({
  borderRadius: borderRadius.medium,
}));

const Footer = styled.View(({ theme: { space } }) => ({
  paddingHorizontal: space[4],
  paddingBottom: space[4],
}));

const AccountSetting = () => {
  const { styles, colors, space } = useTheme();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [accountName, setAccountName] = useState('');
  const userInfo = useAppSelector(getUserInfo);

  const { data: profileData } = useGetProfileInfoQuery(
    userInfo?.profile?._id || '',
    {
      skip: !userInfo?.profile?._id,
    },
  );

  const [updateUserProfile, { isSuccess: isUpdateSuccess, isLoading }] =
    useUpdateProfileMutation();

  const onUsernameChange = (text: string) => {
    setUsername(text);
  };

  const onAccountNameChange = (text: string) => {
    setAccountName(text);
  };

  const handleOnConfirm = () => {
    updateUserProfile({
      id: profileData?._id || '',
      username: username || profileData?.username || '',
      accountName: accountName || profileData?.unique_id || '',
    });
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      Toast.show({
        type: '_success',
        text1: 'Success',
        text2: 'Profile information has been updated',
        position: 'bottom',
      });
    }
  }, [isUpdateSuccess]);

  return (
    <SafeAreaView style={styles.fill} edges={['bottom', 'left', 'right']}>
      <Header title="Account Setting" />
      <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.fill}>
          <TextField
            label="Wallet address (Optional)"
            editable={false}
            value={formatEllipsisMiddle(
              profileData?.walletAddress || '',
              15,
              8,
            )}
            right={
              !profileData?.walletAddress && (
                <ConnectWalletButton onPress={() => setIsModalVisible(true)}>
                  <H4 color={colors.black[4]} fontWeight="bold">
                    Connect wallet
                  </H4>
                </ConnectWalletButton>
              )
            }
          />
          {!profileData?.walletAddress && (
            <H5 color={colors.alertRed} style={{ paddingTop: space[2] }}>
              If you are already registered with a blockchain wallet, please
              connect the wallet to link 2 accounts.
            </H5>
          )}
          <TextField
            defaultValue={profileData?.unique_id}
            label="Account name"
            onChangeText={onAccountNameChange}
          />

          <TextField
            value={profileData?.email}
            label="Email address"
            editable={false}
          />

          <TextField
            defaultValue={profileData?.username}
            label="Username"
            onChangeText={onUsernameChange}
          />
        </View>
      </Container>
      <Footer>
        <ButtonSave text="Save" onPress={handleOnConfirm} loading={isLoading} />
      </Footer>

      <WalletConnectModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default AccountSetting;
