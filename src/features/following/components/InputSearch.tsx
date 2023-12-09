import { Icons } from '@/assets';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const InputWrapper = styled.View(
  ({ theme: { space, borderRadius, colors, scale } }) => ({
    backgroundColor: colors.black[2],
    flexDirection: 'row',
    paddingHorizontal: space[4],

    borderRadius: borderRadius.medium,
    marginTop: space[3],
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: scale(50),
  }),
);

const InputBox = styled.TextInput(({ theme: { space, sizes, colors } }) => ({
  flex: 1,
  marginLeft: space[2],
  fontSize: sizes[3],
  color: colors.white,
}));

interface IProp {
  value: string;
  handleChange: (text: string) => void;
}

const InputSearch = ({ value = '', handleChange }: IProp) => {
  const { colors } = useTheme();
  return (
    <InputWrapper>
      <Icons.SearchInputIcon />
      <InputBox
        value={value}
        onChangeText={e => handleChange(e)}
        placeholder="Search"
        placeholderTextColor={colors.grey[1]}
        selectionColor={colors.lightGreen}
      />
    </InputWrapper>
  );
};

export default InputSearch;
