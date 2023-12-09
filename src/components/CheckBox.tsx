import { Pressable, TextStyle, ViewProps } from 'react-native';
import styled from '@emotion/native';
import { scale } from '@/theme/helper';
import Row from './Row';
import { useTheme } from '@emotion/react';
import { FontWeight, LargeLabel } from './Typography';
import { Icons } from '@/assets';
import { useEffect, useState } from 'react';
type Props = ViewProps & {
  checked?: boolean;
  label?: string;
  isCircle?: boolean;
  onPress?: () => void;
  mode?: 'checkbox' | 'radio';
  styleLabel?: TextStyle;
  fontWeight?: FontWeight;
  disabled?: boolean;
};
const Box = styled.View<{ isChecked: boolean; isCircle?: boolean }>(
  ({
    theme: { space, colors, styles, borderRadius },
    isChecked,
    isCircle,
  }) => ({
    ...styles.center,
    borderWidth: !isChecked ? 1 : 0,
    borderColor: colors.grey[1],
    backgroundColor: isChecked ? colors.lightGreen : 'transparent',
    paddingHorizontal: scale(6),
    height: space[6],
    width: space[6],
    borderRadius: isCircle ? borderRadius.full : borderRadius['xx-small'],
  }),
);
const CheckBox = ({
  checked = false,
  label,
  onPress,
  style,
  mode = 'checkbox',
  isCircle = false,
  styleLabel,
  fontWeight,
  disabled,
}: Props) => {
  const { space } = useTheme();

  const [isChecked, setIsChecked] = useState<boolean>(checked);
  /**
   * handle Call back on press
   */
  const handleCallback = () => {
    if (mode === 'checkbox') {
      setIsChecked(pre => !pre);
    }
    if (onPress) {
      onPress();
    }
  };

  useEffect(() => {
    if (mode === 'radio') {
      setIsChecked(checked);
    }
  }, [checked, mode]);

  return (
    <Pressable onPress={handleCallback} style={style} disabled={disabled}>
      <Row>
        <Box isChecked={isChecked} isCircle={isCircle}>
          {isChecked && <Icons.Check width={space[3]} height={scale(7)} />}
        </Box>
        <LargeLabel
          fontWeight={fontWeight}
          style={{ marginLeft: space[4], ...styleLabel }}>
          {label}
        </LargeLabel>
      </Row>
    </Pressable>
  );
};
export default CheckBox;
