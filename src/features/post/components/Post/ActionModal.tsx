import ModalButton from '@/components/ModalButton';
import CustomModal from '@/components/Modal';
import { H2, H5 } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useCallback, useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ModalTye } from '.';

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
    maxWidth: horizontalSpace[40],
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

const CustomText = styled(H5)(() => ({
  textAlign: 'center',
}));

const HeaderModal = ({
  modalType,
  author,
}: {
  modalType: ModalTye;
  author: string;
}) => {
  const theme = useTheme();

  const renderTitle = useMemo(() => {
    if (modalType === 'Delete') {
      return 'Are you sure you want to delete this post ?';
    } else if (modalType === 'Block') {
      return 'Block ' + author;
    } else {
      return 'Report post';
    }
  }, [author, modalType]);

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
      <CustomHeaderTitle fontWeight="bold">{renderTitle}</CustomHeaderTitle>
    </CustomGradientBg>
  );
};

interface Props {
  onCloseModal: () => void;
  open: boolean;
  onDeletePost: () => void;
  onReportPost?: (reason: string) => void;
  onBlock?: () => void;
  modalType: ModalTye;
  author: string;
  loading?: boolean;
}

const ActionModal = ({
  onCloseModal,
  open,
  onDeletePost,
  modalType,
  onBlock,
  author,
  loading,
}: Props) => {
  const { colors } = useTheme();
  const renderModalButtons = useCallback(() => {
    if (modalType === 'Delete') {
      return (
        <Container>
          <ModalButton
            loading={loading}
            onPress={onDeletePost}
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
    } else if (modalType === 'Block') {
      return (
        <Container>
          <CustomText color={colors.black[0]}>
            The block function should not be at the post level but only
            available only when user visits profile. Suggest to only keep mute
            function here
          </CustomText>
          <ModalButton
            loading={loading}
            onPress={onBlock}
            label={`Block ${author}`}
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
    }
  }, [
    author,
    colors.black,
    colors.grey,
    colors.white,
    loading,
    modalType,
    onBlock,
    onCloseModal,
    onDeletePost,
  ]);

  return (
    <CustomModal
      onBackdropPress={onCloseModal}
      onClose={onCloseModal}
      animationIn={'zoomInDown'}
      animationOut={'zoomOutUp'}
      isVisible={open}
      headerContent={<HeaderModal modalType={modalType} author={author} />}
      bodyContent={renderModalButtons()}
    />
  );
};

export default ActionModal;
