import { Label } from '@/components/Typography';
import styled from '@emotion/native';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

const Container = styled(View)(({ theme: { space } }) => ({
  height: space[10],
  flexDirection: 'row',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'flex-start',
  flex: 1,
}));

const Box = styled(TouchableOpacity)<{ isLast: boolean }>(
  ({ theme: { space }, isLast }) => ({
    paddingRight: isLast ? space[0] : space[6],
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  }),
);

const CustomLabel = styled(Label)<{
  active: boolean;
}>(({ theme: { colors }, active }) => ({
  color: active ? colors.white : colors.black[1],
}));

const Line = styled.View<{
  active: boolean;
}>(({ theme: { space, colors }, active }) => ({
  height: 3,
  backgroundColor: active ? colors.lightGreen : 'transparent',
  width: '100%',
  marginTop: space[2],
  borderRadius: 100,
}));

interface Props {
  data: string[];
  value: number | string;
  onChange: (index: number) => void;
  customStyle?: StyleProp<ViewStyle>;
}

const TabsBar = ({ data, value, onChange, customStyle }: Props) => {
  return (
    <Container style={customStyle}>
      {data.map((item, index) => {
        return (
          <Box
            key={item}
            onPress={() => onChange(index + 1)}
            isLast={data?.length === index + 1}>
            <CustomLabel fontWeight="medium" active={value === index + 1}>
              {item}
            </CustomLabel>
            <Line active={value === index + 1} />
          </Box>
        );
      })}
    </Container>
  );
};

export default TabsBar;
