import { Icons } from '@/assets';
import styled from '@emotion/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';

const IconBox = styled(Pressable)(({ theme: { space } }) => ({
  position: 'absolute',
  right: space[4],
  top: space[4],
}));

const Header = styled(View)({
  position: 'relative',
});

const Body = styled(View)({});

const Bottom = styled(View)({});

interface Props extends Partial<ModalProps> {
  onClose?: () => void;
  headerContent?: React.ReactNode;
  bodyContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
}

const CustomModal = (props: Props) => {
  const { headerContent, bodyContent, bottomContent, onClose } = props;

  return (
    <Modal
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
      {...props}>
      <Header>
        {headerContent}
        {onClose && (
          <IconBox onPress={onClose}>
            <Icons.CloseIcon />
          </IconBox>
        )}
      </Header>
      <Body>{bodyContent}</Body>
      <Bottom>{bottomContent}</Bottom>
    </Modal>
  );
};

export default CustomModal;
