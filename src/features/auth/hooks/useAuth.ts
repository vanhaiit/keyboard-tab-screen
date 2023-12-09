import { useRegisterProfileMutation } from '@/features/profile/slice/api';
import { baseQueryApi } from '@/store/baseQueryApi';
import { useAppDispatch, useAppSelector } from '@/store/type';
import { formatEllipsisMiddle } from '@/utils';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import MetaMaskSDK from '@metamask/sdk';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  trustWallet,
  useConnect,
  useDisconnect,
  useSigner,
} from '@thirdweb-dev/react-native';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Config from 'react-native-config';
import {
  useLazyAppleAuthQuery,
  useLazyGoogleAuthQuery,
  useLoginMutation,
} from '../slice/api';
import { setAuthInfo, setSignInType } from '../slice/authSlice';
import { getAccessToken, getUserInfo } from '../slice/selectors';

const trustWalletConfig = trustWallet();

let ethereum: any;
const sdk = new MetaMaskSDK({
  openDeeplink: (link: string) => {
    Linking.openURL(link);
  },
  timer: BackgroundTimer,
  dappMetadata: {
    name: 'Thinkin DEV',
    url: 'https://thinkin-users.sotatek.works/',
  },
});

ethereum = sdk.getProvider();

const useAuth = () => {
  const [
    googleAuthenticate,
    { isSuccess: googleAuthSuccess, data: googleAuthResponse },
  ] = useLazyGoogleAuthQuery();

  const [
    appleAuthenticate,
    { isSuccess: appleAuthSuccess, data: appleAuthResponse },
  ] = useLazyAppleAuthQuery();

  const [registerProfile] = useRegisterProfileMutation();

  const dispatch = useAppDispatch();

  const connect = useConnect();
  const userInfo = useAppSelector(getUserInfo);
  const accessToken = useAppSelector(getAccessToken);
  const [loading, setLoading] = useState(false);

  const [
    login,
    { isSuccess: connectWalletSuccess, data: connectWalletResponse },
  ] = useLoginMutation();
  const disconnect = useDisconnect();
  const signer = useSigner();

  const logout = useCallback(async () => {
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
  }, [disconnect, dispatch]);

  const handleRetryConnectWallet = () => {
    logout();
    setLoading(false);
  };

  /* for iOS */
  const signMetamask = async () => {
    var from = ethereum.selectedAddress;
    const message = Config.MESSAGE_TO_SIGN!;
    const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
    const signature = await ethereum.request({
      method: 'personal_sign',
      params: [msg, from],
    });
    await login({
      signature,
      address: from,
    });
  };

  const connectMetamask = async () => {
    const result = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    if (result[0]) {
      signMetamask();
    }
    dispatch(setSignInType('METAMASK'));
  };

  const handleConnectWallet = async (type: 'Metamask' | 'Trust') => {
    logout();
    setLoading(true);
    try {
      if (type === 'Metamask') {
        await connectMetamask();
      } else {
        /* todo: connect trust wallet for ios */
        await connect(trustWalletConfig);
        dispatch(setSignInType('TRUST_WALLET'));
      }
    } catch (error) {
      logout();
      setLoading(false);
    }
  };

  useEffect(() => {
    /* Android */
    const handleSignMessage = async () => {
      try {
        const signature = await signer?.signMessage(
          Config.MESSAGE_TO_SIGN || '',
        );
        const address = await signer?.getAddress();
        await login({
          signature,
          address,
        });
      } catch {
        logout();
      }
      setLoading(false);
    };

    if (signer && (!accessToken || !userInfo)) {
      handleSignMessage();
    }
  }, [signer, accessToken, userInfo, login, logout]);

  useEffect(() => {
    if (signer && (!accessToken || !userInfo)) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignInWithGoogle = async () => {
    if (Platform.OS === 'ios') {
      GoogleSignin.configure({
        offlineAccess: false,
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
      });
    } else {
      GoogleSignin.configure({
        webClientId: Config.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
      });
    }
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      if (idToken) {
        await googleAuthenticate({
          id_token: idToken,
        });
      } else {
        throw new Error('invalid id token');
      }
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  };

  const handleSignInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      const { identityToken } = appleAuthRequestResponse;
      if (identityToken) {
        appleAuthenticate({ id_token: identityToken });
      } else {
        throw new Error();
      }
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };

  const createProfile = useCallback(
    async ({ email, userName }: { email?: string; userName: string }) => {
      await registerProfile({
        email,
        userName,
      }).unwrap();
    },
    [registerProfile],
  );

  useEffect(() => {
    if (connectWalletSuccess && connectWalletResponse) {
      createProfile({
        userName: `Thinker${formatEllipsisMiddle(
          connectWalletResponse?.updatedUser.username,
          0,
          3,
        )}`,
      });
    }
  }, [connectWalletResponse, connectWalletSuccess, createProfile]);

  useEffect(() => {
    if (googleAuthSuccess) {
      dispatch(
        setAuthInfo({
          signInType: 'GOOGLE',
          accessToken: googleAuthResponse?.jwt,
          userInfo: googleAuthResponse?.user,
        }),
      );

      if (!googleAuthResponse?.user?.profile) {
        createProfile({
          userName: googleAuthResponse?.user?.username || '',
          email: googleAuthResponse?.user?.email || '',
        });
      }
    }

    if (appleAuthSuccess) {
      dispatch(
        setAuthInfo({
          signInType: 'APPLE',
          accessToken: appleAuthResponse?.jwt,
          userInfo: appleAuthResponse?.user,
        }),
      );

      if (!appleAuthResponse?.user?.profile) {
        createProfile({
          email: appleAuthResponse?.user?.email || '',
          userName: appleAuthResponse?.user.username || '',
        });
      }
    }
  }, [
    dispatch,
    googleAuthSuccess,
    googleAuthResponse,
    appleAuthSuccess,
    appleAuthResponse,
    registerProfile,
    createProfile,
  ]);

  return {
    loading,
    handleConnectWallet,
    handleRetryConnectWallet,
    handleSignInWithGoogle,
    handleSignInWithApple,
    logout,
  };
};

export default useAuth;
