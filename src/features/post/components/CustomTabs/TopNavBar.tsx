import { Label } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';

const Container = styled(View)<{
  width: number;
}>(({ theme: { colors, space }, width }) => ({
  backgroundColor: colors.black[5],
  flexDirection: 'row',
  gap: space[1],
  padding: space[2],
  borderRadius: 100,
  width: width,
  height: space[10],
  alignItems: 'center',
}));

const Box = styled(TouchableOpacity)<{
  width: number;
}>(({ theme: { space }, width }) => ({
  paddingHorizontal: space[2],
  justifyContent: 'center',
  alignItems: 'center',
  width: width,
  height: '100%',
  zIndex: 2,
}));
const ActiveBackground = styled(Animated.View)<{
  width: number;
}>(({ theme: { colors, space }, width }) => ({
  backgroundColor: colors.black[6],
  width: width,
  height: space[7],
  position: 'absolute',
  margin: space[2],
  borderRadius: 100,
  zIndex: 1,
}));
const CustomLabel = styled(Label)<{
  active: boolean;
}>(({ theme: { colors }, active }) => ({
  color: active ? colors.white : colors.grey[1],
}));
interface Props {
  itemWidth: number;
  data: string[];
  value: number;
  onChange: (index: number) => void;
  activeAnimation?: boolean;
}

const TopNavBar = ({
  data,
  itemWidth,
  value,
  onChange,
  activeAnimation = true,
}: Props) => {
  const { space } = useTheme();
  const animationValue = useRef(new Animated.Value(0)).current;

  const navbarWidth = useMemo(() => {
    const gap = space[1];
    const padding = space[2];
    return data.length > 1
      ? data.length * itemWidth + padding * 2 + (data.length - 1) * gap
      : data.length * itemWidth + padding * 2;
  }, [data.length, itemWidth, space]);

  useEffect(() => {
    for (let index in data) {
      if (value === Number(index) + 1) {
        if (activeAnimation) {
          Animated.timing(animationValue, {
            toValue: itemWidth * Number(index) + 1 + space[1] * Number(index),
            useNativeDriver: true,
            duration: 300,
          }).start();
        } else {
          animationValue.setValue(
            itemWidth * Number(index) + 1 + space[1] * Number(index),
          );
        }
      }
    }
  }, [value, data, animationValue, activeAnimation, itemWidth, space]);

  return (
    <Container width={navbarWidth}>
      {data.map((item, index) => {
        return (
          <Box key={item} width={itemWidth} onPress={() => onChange(index + 1)}>
            <CustomLabel
              fontWeight={value === index + 1 ? 'bold' : 'normal'}
              active={value === index + 1}>
              {item}
            </CustomLabel>
          </Box>
        );
      })}

      <ActiveBackground
        width={itemWidth}
        style={{
          transform: [
            {
              translateX: animationValue,
            },
          ],
        }}
      />
    </Container>
  );
};

export default TopNavBar;
