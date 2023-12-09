import { Icons } from '@/assets';
import CustomModal from '@/components/Modal';
import styled from '@emotion/native';
import { H2, H5, LargeLabel } from './Typography';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppRootParams } from '@/navigations/types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNewUser } from '@/features/auth/slice/authSlice';
import { Pressable } from 'react-native';

const Container = styled.View(
  ({ theme: { space, horizontalSpace, colors, borderRadius } }) => ({
    backgroundColor: colors.white,
    paddingHorizontal: horizontalSpace[6],
    paddingVertical: space[6],
    borderTopLeftRadius: borderRadius.medium,
    borderTopRightRadius: borderRadius.medium,
    alignItems: 'center',
  }),
);

const HiText = styled(H2)(({ theme: { colors } }) => ({
  color: colors.black[3],
}));

const ShareText = styled(H2)(({ theme: { colors, space } }) => ({
  color: colors.black[3],
  textAlign: 'center',
  width: space[50],
  marginBottom: space[2],
}));

const YourText = styled(H5)(({ theme: { colors, space } }) => ({
  color: colors.black[3],
  textAlign: 'center',
  width: space[32],
}));
const MakeText = styled(H5)(({ theme: { colors } }) => ({
  color: colors.black[3],
}));

const CustomGradientBg = styled(LinearGradient)(
  ({ theme: { horizontalSpace, space, borderRadius } }) => ({
    borderBottomLeftRadius: borderRadius.medium,
    borderBottomRightRadius: borderRadius.medium,
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[4],
  }),
);

const BtnStart = styled.TouchableOpacity(
  ({ theme: { colors, space, borderRadius } }) => ({
    backgroundColor: colors.black[0],
    alignItems: 'center',
    paddingVertical: space[4],
    borderRadius: borderRadius.medium,
  }),
);

const BtnLink = styled.TouchableOpacity(({ theme: { space } }) => ({
  alignItems: 'center',
  marginTop: space[4],
  marginBottom: space[2],
}));

const LargeLabelStyle = styled(LargeLabel)(({ theme: { colors } }) => ({
  color: colors.black[3],
  textDecorationLine: 'underline',
}));

const BtnClose = styled.TouchableOpacity(({ theme: { space } }) => ({
  position: 'absolute',
  right: space[4],
  top: space[4],
}));

const LinkToProfileText = styled(H5)(({ theme: { space } }) => ({
  textDecorationStyle: 'solid',
  textDecorationLine: 'underline',
  textDecorationColor: '#7EE5A2',
  paddingTop: space[2],
  textAlign: 'center',
}));

const RenderContent = ({
  onClose,
  onStart,
  toSetting,
}: {
  onClose?: () => void;
  onStart?: () => void;
  toSetting: () => void;
}) => {
  const theme = useTheme();

  return (
    <>
      <Container>
        <BtnClose onPress={onClose}>
          <Icons.CloseIcon />
        </BtnClose>
        <Icons.MobileIcon />
        <HiText fontWeight="bold">Hi Thinker :)</HiText>
        <ShareText fontWeight="bold">
          Share your think and create value
        </ShareText>
        <YourText fontWeight="normal">
          Your post comes alive in the world of Thinkin!
        </YourText>
        <MakeText fontWeight="normal">
          Make more value in the post process.
        </MakeText>
        <Pressable onPress={toSetting}>
          <LinkToProfileText color={'#7EE5A2'} fontWeight="bold">
            You may want to update your account setting for the first time
            logging in
          </LinkToProfileText>
        </Pressable>
      </Container>
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
        <BtnStart onPress={onStart}>
          <LargeLabel fontWeight="bold">Start posting</LargeLabel>
        </BtnStart>
        <BtnLink onPress={onClose}>
          <LargeLabelStyle fontWeight="bold">
            I want to look around a bit more!
          </LargeLabelStyle>
        </BtnLink>
      </CustomGradientBg>
    </>
  );
};

const WelcomeModal = () => {
  const { navigate } = useNavigation<NavigationProp<AppRootParams>>();
  const [isVisible, setVisible] = useState(true);
  const dispatch = useDispatch();

  const close = () => {
    setVisible(false);
    dispatch(setNewUser(false));
  };

  const navigateToCreatePost = () => {
    close();
    navigate('CreatePost');
  };

  const navigateToAccountSetting = () => {
    close();
    navigate('AccountSetting');
  };

  return (
    <CustomModal
      isVisible={isVisible}
      bodyContent={
        <RenderContent
          onClose={close}
          onStart={navigateToCreatePost}
          toSetting={navigateToAccountSetting}
        />
      }
      onClose={close}
    />
  );
};

export default WelcomeModal;
