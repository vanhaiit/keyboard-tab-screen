import React from 'react';
import styled from '@emotion/native';
import { H5 } from './Typography';
import { TextInputProps, ViewProps } from 'react-native';
import { useTheme } from '@emotion/react';
import Row from './Row';

type Props = {
  label?: string;
  right?: React.ReactNode;
} & TextInputProps &
  ViewProps;

const StyledInput = styled.TextInput(({ theme: { colors } }) => ({
  flex: 1,
  color: colors.white,
}));

const InputWrapper = styled(Row)(
  ({ theme: { space, scale, borderRadius, colors } }) => ({
    height: scale(50),
    width: '100%',
    backgroundColor: colors.black[0],
    borderRadius: borderRadius.small,
    paddingLeft: space[4],
    paddingHorizontal: space[2],
  }),
);

const Label = styled(H5)(({ theme: { space } }) => ({
  marginBottom: space[2],
  marginTop: space[4],
}));

const TextField = ({ label, right, style, ...props }: Props) => {
  const { colors } = useTheme();
  return (
    <>
      {label && <Label fontWeight="bold">{label}</Label>}
      <InputWrapper style={style}>
        <StyledInput {...props} placeholderTextColor={colors.grey[1]} />
        {right}
      </InputWrapper>
    </>
  );
};

export default TextField;
