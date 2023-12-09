import styled from '@emotion/native';
import { TextStyle, TouchableOpacityProps, ViewStyle } from 'react-native';
import { H4 } from './Typography';
import { ActivityIndicator } from 'react-native';
import { useTheme } from '@emotion/react';

const StyledButton = styled.TouchableOpacity<{ background?: string }>(
  ({ theme: { colors, space, scale }, background }) => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: background || colors.lightGreen,
    paddingHorizontal: space[2],
    height: scale(50),
    width: '100%',
  }),
);

type Props = {
  backgroundColor?: string;
  textColor?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  text: string;
  loading?: boolean;
  disabled?: boolean;
  colorLoading?: string;
} & TouchableOpacityProps;

const Button = ({
  text,
  loading,
  buttonStyle,
  backgroundColor,
  textColor,
  disabled,
  colorLoading,
  ...props
}: Props) => {
  const { colors } = useTheme();
  return (
    <StyledButton
      style={buttonStyle}
      background={backgroundColor}
      disabled={disabled}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size={'small'}
          color={colorLoading || colors.white}
        />
      ) : (
        <H4 color={textColor || colors.black[4]} fontWeight="bold">
          {text}
        </H4>
      )}
    </StyledButton>
  );
};

export default Button;
