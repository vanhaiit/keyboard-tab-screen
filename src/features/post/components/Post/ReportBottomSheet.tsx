import BottomSheet from '@/components/BottomSheet';
import InputField from '@/components/InputField';
import ModalButton from '@/components/ModalButton';
import { H5 } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useCallback, useMemo } from 'react';

const Body = styled.View(({ theme: { space } }) => ({
  gap: space[4],
  marginBottom: space[4],
}));

const ButtonWrapper = styled.View(({ theme: { space } }) => ({
  gap: space[2],
  width: '100%',
}));
const FooterContainer = styled.View(({ theme: { styles } }) => ({
  ...styles.center,
  width: '100%',
}));

interface Props {
  open: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  onChangeText?: (val: string) => void;
  textValue: string;
  isBlinding?: boolean;
  loading?: boolean;
}

const ReportBottomSheet = ({
  open,
  textValue,
  onClose = () => {},
  onChangeText,
  onSubmit,
  isBlinding,
  loading,
}: Props) => {
  const { colors } = useTheme();

  const handleSubmit = useCallback(() => {
    if (textValue && onSubmit) {
      onSubmit();
    }
  }, [onSubmit, textValue]);

  const renderReport = useCallback(() => {
    return (
      <Body>
        <H5 fontWeight="medium" color={colors.grey[1]}>
          {isBlinding
            ? 'Please tell me why you are blinding this post'
            : 'Help us understand the problem.What is going on with this post?'}
        </H5>
        <InputField
          bg={colors.black[3]}
          value={textValue}
          onChangeText={onChangeText}
          multiline
        />
      </Body>
    );
  }, [colors.black, colors.grey, isBlinding, onChangeText, textValue]);

  const renderButtons = useMemo(() => {
    return (
      <FooterContainer>
        <ButtonWrapper>
          <ModalButton
            loading={loading}
            onPress={handleSubmit}
            label="Report"
            backgroundColor={!textValue ? colors.grey[1] : colors.lightGreen}
            labelColor={colors.black[0]}
            borderColor="transparent"
          />
          <ModalButton
            onPress={onClose}
            label="Cancel"
            backgroundColor="transparent"
            labelColor={colors.grey[1]}
            borderColor={colors.grey[1]}
          />
        </ButtonWrapper>
      </FooterContainer>
    );
  }, [
    colors.black,
    colors.grey,
    colors.lightGreen,
    handleSubmit,
    loading,
    onClose,
    textValue,
  ]);
  return (
    <BottomSheet
      title={isBlinding ? 'Reason' : 'Report Post'}
      isVisible={open}
      closeModal={onClose}
      showDivider={true}
      renderContent={renderReport}
      renderButtons={renderButtons}
    />
  );
};

export default ReportBottomSheet;
