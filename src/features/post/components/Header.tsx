import { Icons } from '@/assets';
import Header from '@/components/Header';
import { setAuthInfo } from '@/features/auth/slice/authSlice';
import { useGetNotificationQuery } from '@/features/notification/slice/api';
import { AppRootParams } from '@/navigations/types';
import { baseQueryApi } from '@/store/baseQueryApi';
import { useAppDispatch } from '@/store/type';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDisconnect } from '@thirdweb-dev/react-native';
import { Pressable, TouchableOpacity } from 'react-native';

const POLLING_INTERVAL = 30000;

const HeaderRightContainer = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: space[3],
}));

const DotUnread = styled.View(({ theme }) => ({
  width: 14,
  height: 14,
  position: 'absolute',
  top: '-20%',
  right: '-20%',
  backgroundColor: theme.colors.alertRed,
  borderWidth: 2,
  borderColor: theme.colors.black[0],
  borderStyle: 'solid',
  borderRadius: theme.borderRadius.full,
}));

const MainHeader = () => {
  const disconnect = useDisconnect();
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation<NavigationProp<AppRootParams>>();
  const { colors, space } = useTheme();

  const { data: unReadNotificationData } = useGetNotificationQuery(
    {
      status: 'unread',
    },
    {
      pollingInterval: POLLING_INTERVAL,
    },
  );

  const unReadNotificationDataList = unReadNotificationData || [];

  const handleDisconnect = async () => {
    await disconnect();
    dispatch(
      setAuthInfo({
        accessToken: null,
        userInfo: null,
        signInType: null,
      }),
    );
    dispatch(baseQueryApi.util.resetApiState());
    await GoogleSignin.revokeAccess();
  };

  const handlePressNotification = () => {
    navigate('Notification');
  };

  const handlePressSearch = () => {
    navigate('Search');
  };

  const renderNotificationIcon = () => {
    return (
      <TouchableOpacity
        style={{ position: 'relative' }}
        onPress={handlePressNotification}>
        <Icons.NotificationIcon color={colors.white} />
        {unReadNotificationDataList?.length > 0 && <DotUnread />}
      </TouchableOpacity>
    );
  };

  const headerRight = () => (
    <HeaderRightContainer>
      <TouchableOpacity onPress={handlePressSearch}>
        <Icons.SearchIcon
          width={space[6]}
          height={space[6]}
          color={colors.white}
        />
      </TouchableOpacity>
      {renderNotificationIcon()}
    </HeaderRightContainer>
  );

  const headerLeft = () => (
    <Pressable onPress={handleDisconnect}>
      <Icons.AppLogo />
    </Pressable>
  );

  return <Header headerLeft={headerLeft} headerRight={headerRight} />;
};

export default MainHeader;
