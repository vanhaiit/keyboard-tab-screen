import { Icons } from '@/assets';
import { H5, Label } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { ReactNode } from 'react';
import { Platform, TextInputProps } from 'react-native';
interface Props extends TextInputProps {
  label?: string;
  onDelete?: () => void;
  icon?: ReactNode;
  require?: boolean;
  bg?: string;
  errorMg?: string;
}

export default function InputField(props: Props) {
  const { colors, space } = useTheme();
  const { label, require, multiline, icon, onDelete, bg, errorMg } = props;
  return (
    <Container>
      <LabelContainer>
        {label && <LabelInput fontWeight="bold">{label}</LabelInput>}
        {require && <Require>*</Require>}
      </LabelContainer>
      <Input
        style={multiline && { height: space[30] }}
        placeholderTextColor={colors.grey[1]}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
        bg={bg}
        multiline={multiline}
        error={!!errorMg}
      />
      {onDelete && (
        <DeleteOption onPress={onDelete}>
          {icon || <Icons.Close color={colors.grey[1]} />}
        </DeleteOption>
      )}
      <ErrorMg>{errorMg}</ErrorMg>
    </Container>
  );
}

const ErrorMg = styled(Label)(({ theme: { colors, space } }) => ({
  color: colors.alertRed,
  marginTop: space[1],
}));

const LabelContainer = styled.View(() => ({
  flexDirection: 'row',
}));

const Require = styled(H5)(({ theme: { colors, space } }) => ({
  color: colors.alertRed,
  paddingLeft: space[1],
}));

const Container = styled.View(({ theme: { space } }) => ({
  marginBottom: space[4],
  borderStartColor: 'red',
}));

const LabelInput = styled(H5)(({ theme: { colors, space } }) => ({
  color: colors.white,
  marginBottom: space[2],
}));

const Input = styled.TextInput<{
  bg?: string;
  multiline?: boolean;
  error?: boolean;
}>(
  ({
    theme: { colors, borderRadius, space },
    bg,
    multiline,
    error = false,
  }) => ({
    height: space[12],
    width: '100%',
    backgroundColor: bg || colors.black[0],
    borderRadius: borderRadius.small,
    paddingLeft: space[4],
    paddingRight: space[4],
    paddingTop:
      Platform.OS === 'android' ? space[2] : multiline ? space[2] : space[0],
    color: colors.white,
    paddingHorizontal: 0,
    borderWidth: error ? 1 : 0,
    borderColor: colors.alertRed,
  }),
);

const DeleteOption = styled.TouchableOpacity(({ theme: { space } }) => ({
  width: space[12],
  position: 'absolute',
  right: 0,
  top: space[4],
  paddingRight: space[4],
  justifyContent: 'center',
  alignItems: 'flex-end',
  minHeight: space[4],
  zIndex: 2,
}));
