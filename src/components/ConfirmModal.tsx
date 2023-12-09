import ModalButton from '@/components/ModalButton';
import CustomModal from '@/components/Modal';
import { H2 } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import LinearGradient from 'react-native-linear-gradient';

const Container = styled.View(({ theme: { space, horizontalSpace } }) => ({
  backgroundColor: 'white',
  paddingHorizontal: horizontalSpace[6],
  paddingVertical: space[6],
  gap: space[2],
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
}));

const CustomHeaderTitle = styled(H2)(
  ({ theme: { colors, horizontalSpace } }) => ({
    color: colors.black[3],
    maxWidth: horizontalSpace[50],
    textAlign: 'center',
  }),
);
const CustomGradientBg = styled(LinearGradient)(
  ({ theme: { sizes, horizontalSpace, space } }) => ({
    borderTopLeftRadius: sizes[3],
    borderTopRightRadius: sizes[3],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalSpace[5],
    paddingVertical: space[5],
  }),
);

export const HeaderModal = ({ content }: { content: string }) => {
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
      <CustomHeaderTitle fontWeight="bold">{content}</CustomHeaderTitle>
    </CustomGradientBg>
  );
};

interface Props {
  onCloseModal: () => void;
  open: boolean;
  onConfirm: () => void;
  content: string;
}

const ConfirmModal = ({ onCloseModal, open, onConfirm, content }: Props) => {
  const { colors } = useTheme();
  const renderModalButtons = () => {
    return (
      <Container>
        <ModalButton
          onPress={onConfirm}
          label="Confirm"
          backgroundColor={colors.black[0]}
          labelColor={colors.white}
          borderColor="unset"
        />
        <ModalButton
          onPress={onCloseModal}
          label="Cancel"
          backgroundColor="transparent"
          labelColor={colors.black[0]}
          borderColor={colors.grey[1]}
        />
      </Container>
    );
  };

  return (
    <CustomModal
      onBackdropPress={onCloseModal}
      onClose={onCloseModal}
      animationIn={'zoomInDown'}
      animationOut={'zoomOutUp'}
      isVisible={open}
      headerContent={<HeaderModal content={content} />}
      bodyContent={renderModalButtons()}
    />
  );
};

export default ConfirmModal;
