import Header from '@/components/Header';
import { useTheme } from '@emotion/react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from '@emotion/native';
import { AppRootParams } from '@/navigations/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Button from '@/components/Button';
import { View } from 'react-native';
import { Label, H5, H4 } from '@/components/Typography';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/type';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { useGetProfileInfoQuery, useUpdateProfileMutation } from '../slice/api';
import Toast from 'react-native-toast-message';

const Settings = () => {
  const { styles, colors } = useTheme();
  const { navigate, goBack } =
    useNavigation<NavigationProp<AppRootParams, 'Settings'>>();
  const userInfo = useAppSelector(getUserInfo);

  const [text, setText] = useState('');
  const [tab, setTap] = useState('settings');

  const { data: profileData } = useGetProfileInfoQuery(
    userInfo?.profile?._id || '',
    {
      skip: !userInfo?.profile?._id,
    },
  );

  const [updateUserProfile, { isSuccess: isUpdateSuccess, isLoading }] =
    useUpdateProfileMutation();

  useEffect(() => {
    setText(profileData?.yourselfDescription || '');
  }, [profileData]);

  const handleChangeText = (e: string) => {
    if (e?.length >= 150) {
      return;
    }
    setText(e);
  };

  const handleOnConfirm = () => {
    updateUserProfile({
      id: profileData?._id || '',
      yourselfDescription: text || '',
    });
  };

  const handleBack = () => {
    if (tab === 'settings') {
      goBack();
    } else {
      setTap('settings');
    }
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
      <Header
        title={tab === 'settings' ? 'Settings' : 'Customize profile'}
        onPressBackButton={handleBack}
      />
      <Body>
        {tab === 'settings' ? (
          <>
            <Option onPress={() => navigate('AccountSetting')}>
              <H4 fontWeight="normal">Account</H4>
            </Option>
            <Option>
              <H4 fontWeight="normal" onPress={() => setTap('customize')}>
                Customize profile
              </H4>
            </Option>
          </>
        ) : (
          <>
            <View style={styles.fill}>
              <LabelField>
                <Label fontWeight="bold" color={colors.white}>
                  About me (optional)
                </Label>
                <H5>{text?.length}/150</H5>
              </LabelField>
              <StyledInput
                placeholderTextColor={colors.grey[1]}
                multiline={true}
                value={text}
                onChangeText={handleChangeText}
                textAlignVertical="top"
              />
            </View>
            <Footer>
              <ButtonSave
                text="Save"
                onPress={handleOnConfirm}
                loading={isLoading}
              />
            </Footer>
          </>
        )}
      </Body>
    </SafeAreaView>
  );
};

export default Settings;

const Body = styled.View(({ theme }) => ({
  flex: 1,
  paddingHorizontal: theme.space[4],
  marginTop: theme.space[3],
}));

const Option = styled.TouchableOpacity(
  ({ theme: { horizontalSpace, space, borderRadius, colors } }) => ({
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[3],
    borderRadius: borderRadius.medium,
    backgroundColor: colors.black[2],
    marginBottom: space[3],
  }),
);

const Footer = styled.View(({ theme: { space } }) => ({
  paddingBottom: space[4],
}));

const ButtonSave = styled(Button)(({ theme: { borderRadius } }) => ({
  borderRadius: borderRadius.medium,
}));

const LabelField = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: space[3],
}));

const StyledInput = styled.TextInput(
  ({ theme: { colors, space, borderRadius, horizontalSpace } }) => ({
    color: colors.white,
    backgroundColor: colors.black[2],
    paddingVertical: space[3],
    paddingHorizontal: horizontalSpace[4],
    borderRadius: borderRadius.medium,
    height: space[40],
  }),
);
