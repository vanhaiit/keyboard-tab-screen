import { Label } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgProps } from 'react-native-svg';

const Container = styled(TouchableOpacity)(({ theme: { space } }) => ({
  gap: space[3],
}));

const Title = styled(Label)(({ theme: { colors } }) => ({
  color: colors.palette.black[3],
  textAlign: 'center',
}));

interface Props {
  icon: React.FC<SvgProps>;
  label: string;
  onPress?: () => void;
}

const WalletButton = ({ icon: Icon, label, onPress }: Props) => {
  const { space } = useTheme();
  if (typeof Icon === 'function') {
    return (
      <Container onPress={onPress}>
        <Icon width={space[18]} height={space[18]} />
        <Title fontWeight="bold">{label}</Title>
      </Container>
    );
  } else {
    return (
      <Container onPress={onPress}>
        <FastImage
          source={Icon}
          resizeMode="contain"
          style={{
            height: space[18],
            width: space[18],
          }}
        />
        <Title fontWeight="bold">{label}</Title>
      </Container>
    );
  }
};

export default WalletButton;
