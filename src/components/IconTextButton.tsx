import styled from '@emotion/native';
import { TouchableOpacity } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { H4 } from './Typography';
import { useTheme } from '@emotion/react';

const Container = styled(TouchableOpacity)(
  ({ theme: { colors, space, borderRadius } }) => ({
    alignItems: 'center',
    backgroundColor: colors.palette.black[2],
    flexDirection: 'row',
    paddingHorizontal: space[6],
    paddingVertical: space[2],
    borderRadius: borderRadius.medium,
    gap: space[2],
    width: '50%',
  }),
);

interface Props {
  label: string;
  icon: React.FC<SvgProps>;
  size: number;
  onPress?: () => void;
}

const IconTextButton: React.FC<Props> = ({
  label,
  icon: Icon,
  size,
  onPress,
}) => {
  const { colors } = useTheme();
  return (
    <Container onPress={onPress}>
      <Icon
        width={size}
        height={size}
        color={colors.white}
        style={{ flex: 1 }}
      />
      <H4 fontWeight="bold" style={{ flex: 4 }}>
        {label}
      </H4>
    </Container>
  );
};

export default IconTextButton;
