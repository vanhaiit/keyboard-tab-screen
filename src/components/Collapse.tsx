import { Icons } from '@/assets';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useRef } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';
import { H4, H5 } from './Typography';
interface IProps {
  title: string;
  description: string;
}

const Collapse = ({ title, description }: IProps) => {
  let open = false;
  const { colors, space } = useTheme();
  const rotationValue = useRef(new Animated.Value(0)).current;
  const collapseValue = useRef(new Animated.Value(0)).current;

  const interpolatedRotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  const interpolatedHeight = collapseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [space[12], space[30]],
  });

  const onExpend = () => {
    Animated.timing(rotationValue, {
      toValue: open ? 0 : 1,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    Animated.timing(collapseValue, {
      toValue: open ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    open = !open;
  };

  return (
    <Container style={{ maxHeight: interpolatedHeight }}>
      <Header>
        <Left>
          <Title>{title}</Title>
        </Left>
        <Right>
          <TouchableOpacity onPress={onExpend}>
            <BoxIcon style={{ transform: [{ rotate: interpolatedRotation }] }}>
              <Icons.ArrowDown color={colors.lightGreen} />
            </BoxIcon>
          </TouchableOpacity>
        </Right>
      </Header>
      <Content>
        <Description>{description}</Description>
      </Content>
    </Container>
  );
};

export default Collapse;

const Header = styled.View(() => ({
  justifyContent: 'space-between',
  flexDirection: 'row',
  width: '100%',
}));

const Content = styled.View(({ theme: { space } }) => ({
  marginTop: space[3],
}));

const BoxIcon = styled(Animated.View)(({}) => ({
  //   transform: [{ rotate: `${0}deg` }],
}));

const Description = styled(H5)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const Title = styled(H4)(({ theme: { colors } }) => ({
  color: colors.white,
}));

const Left = styled.View(() => ({}));

const Right = styled.View(() => ({}));

const Container = styled(Animated.View)(
  ({ theme: { colors, borderRadius, space } }) => ({
    width: '100%',
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.small,
    marginBottom: space[4],
    padding: space[4],
    overflow: 'hidden',
    maxHeight: space[12],
  }),
);
