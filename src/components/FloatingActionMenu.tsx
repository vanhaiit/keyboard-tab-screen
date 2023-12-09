/* eslint-disable react-native/no-inline-styles */
import Modal from 'react-native-modal';
import IconTextButton from './IconTextButton';
import { Icons } from '@/assets';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParams } from '@/navigations/types';
import { BOTTOM_TAB_HEIGHT } from '@/theme/helper';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';

type Props = {
  isVisible: boolean;
  close: () => void;
};

const ModalWrapper = styled.View(({ theme: { space } }) => ({
  borderWidth: 0,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  gap: space[2],
}));

const FloatingActionMenu = ({ isVisible, close }: Props) => {
  const { navigate } = useNavigation<NavigationProp<AppStackParams, 'Tab'>>();
  const { space } = useTheme();
  return (
    <Modal
      backdropTransitionInTiming={500}
      animationOut="fadeOut"
      animationInTiming={500}
      style={{
        position: 'absolute',
        bottom: BOTTOM_TAB_HEIGHT + space[7],
        margin: 0,
        left: 0,
        right: 0,
      }}
      isVisible={isVisible}
      onBackdropPress={close}>
      <ModalWrapper>
        <IconTextButton
          onPress={() => {
            navigate('CreatePost');
            close();
          }}
          size={space[6]}
          icon={Icons.EditIcon}
          label={'Post Now'}
        />
        <IconTextButton
          size={space[6]}
          icon={Icons.UserIcon}
          label={'Create DAO'}
          onPress={() => {
            navigate('CreateDAO');
            close();
          }}
        />
      </ModalWrapper>
    </Modal>
  );
};

export default FloatingActionMenu;
