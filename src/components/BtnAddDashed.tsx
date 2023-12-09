import { Icons } from '@/assets';
import styled from '@emotion/native';

interface Props {
  onPress?: () => void;
  label: string;
}
export default function BtnAddDashed({ onPress, label }: Props) {
  return (
    <Container onPress={onPress}>
      <IconBox>
        <Icons.AddCircle />
      </IconBox>
      <Title>{label}</Title>
    </Container>
  );
}

const Container = styled.TouchableOpacity(
  ({ theme: { borderRadius, colors, space } }) => ({
    flexDirection: 'row',
    height: space[12],
    borderColor: colors.grey[2],
    borderRadius: borderRadius.small,
    borderStyle: 'dashed',
    borderWidth: 2,
    alignItems: 'center',
    paddingLeft: space[4],
  }),
);

const IconBox = styled.View(() => ({}));

const Title = styled.Text(({ theme: { colors, space } }) => ({
  paddingLeft: space[2],
  color: colors.grey[1],
}));
