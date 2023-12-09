import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { ActivityIndicator } from 'react-native';
import { H4 } from './Typography';

const Container = styled.TouchableOpacity<{
  backgroundColor: string;
  borderColor: string;
}>(({ backgroundColor, borderColor, theme: { space, styles } }) => ({
  backgroundColor,
  borderColor,
  borderWidth: borderColor ? 1 : 0,
  borderStyle: 'solid',
  borderRadius: 10,
  width: '100%',
  height: space[12],
  ...styles.center,
}));

interface Props {
  label: string;
  labelColor?: string;
  backgroundColor: string;
  borderColor: string;
  onPress?: () => void;
  loading?: boolean;
}

const ModalButton = ({
  labelColor,
  label,
  backgroundColor,
  borderColor,
  onPress,
  loading,
}: Props) => {
  const { colors } = useTheme();
  return (
    <Container
      disabled={!!loading}
      onPress={onPress}
      backgroundColor={backgroundColor}
      borderColor={borderColor}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <H4 fontWeight="bold" color={labelColor}>
          {label}
        </H4>
      )}
    </Container>
  );
};

export default ModalButton;
