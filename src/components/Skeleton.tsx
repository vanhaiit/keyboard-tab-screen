import styled from '@emotion/native';
import { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

const Container = styled(Animated.View)(() => ({
  width: '100%',
  height: '100%',
}));

interface Props {
  style: ViewProps;
}

const Skeleton = ({ style }: Props) => {
  const animationValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animationValue]);

  return (
    <Container
      style={{
        ...style,
        opacity: animationValue,
      }}></Container>
  );
};

export default Skeleton;
