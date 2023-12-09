import useBottomSheet from '@/hooks/useBottomSheet';
import { scale } from '@/theme/helper';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Animated, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { H3, H4, H5 } from './Typography';

type BottomSheetProps = {
  isVisible: boolean;
  title?: string;
  description?: string;
  closeModal: () => void;
  renderContent?: () => JSX.Element;
  renderFooter?: () => JSX.Element;
  buttonTitle?: string;
  onButtonPress?: () => void;
  showDivider?: boolean;
  renderButtons?: React.ReactNode;
};

const ModalContainer = styled(Animated.View)(
  ({ theme: { space, colors, window, borderRadius } }) => ({
    borderWidth: 0,
    minHeight: window.height * 0.2,
    backgroundColor: colors.palette.black[2],
    paddingBottom: space[6],
    borderTopLeftRadius: borderRadius['x-large'],
    borderTopRightRadius: borderRadius['x-large'],
    paddingHorizontal: space[4],
    paddingTop: space[4],
    flex: 1,
  }),
);

const Divider = styled.View(({ theme: { space, colors } }) => ({
  width: '100%',
  height: 1,
  backgroundColor: colors.palette.whiteTransparent[1],
  marginVertical: space[4],
}));

const BottomButton = styled.TouchableOpacity(
  ({ theme: { space, colors, borderRadius } }) => ({
    width: '100%',
    height: scale(50),
    backgroundColor: colors.palette.lightGreen,
    paddingVertical: space[3],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.small,
  }),
);

const TopLine = styled.View(({ theme: { space, colors, borderRadius } }) => ({
  width: '100%',
  alignSelf: 'center',
  height: space[1],
  backgroundColor: colors.palette.whiteTransparent[1],
  borderRadius: borderRadius.small,
  marginBottom: space[5],
}));

const DraggableContainer = styled.View(({ theme: { space } }) => ({
  width: '35%',
  alignSelf: 'center',
  height: space[8],
  justifyContent: 'center',
  alignItems: 'center',
}));

const Description = styled(H5)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const BottomSheet = ({
  isVisible,
  closeModal,
  title,
  description,
  renderContent,
  renderFooter,
  buttonTitle,
  onButtonPress,
  showDivider = true,
  renderButtons,
}: BottomSheetProps) => {
  const { colors } = useTheme();
  const { onLayout, sheetHeight, panResponder, animatedValue } = useBottomSheet(
    {
      closeModal,
      isVisible,
    },
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      style={styles.bottomSheet}>
      <ModalContainer
        onLayout={onLayout}
        style={{
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, sheetHeight],
                outputRange: [0, sheetHeight],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}>
        <DraggableContainer {...panResponder.current.panHandlers}>
          <TopLine />
        </DraggableContainer>
        {title && <H3 fontWeight="bold">{title}</H3>}
        {description && <Description>{description}</Description>}
        {showDivider && <Divider />}

        {renderContent && renderContent()}
        {renderFooter ? (
          renderFooter()
        ) : renderButtons ? (
          renderButtons
        ) : (
          <BottomButton onPress={onButtonPress}>
            <H4 color={colors.palette.black[0]} fontWeight="bold">
              {buttonTitle}
            </H4>
          </BottomButton>
        )}
      </ModalContainer>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    margin: 0,
    justifyContent: 'flex-end',
    left: 0,
    right: 0,
  },
});
