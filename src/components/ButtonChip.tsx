import Row from '@/components/Row';
import React, { ReactNode } from 'react';

import { SmallLabel } from '@/components/Typography';
import styled from '@emotion/native';
import { TouchableOpacity, ViewProps } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';

type Props = ViewProps & {
  icon?: ReactNode;
  imageSrc?: Source;
  label: string;
  onPress?: () => void;
  styleImage?: any;
};

const Container = styled(Row)(
  ({ theme: { space, colors, borderRadius, styles } }) => ({
    ...styles.center,
    borderRadius: borderRadius['xx-large'],
    backgroundColor: colors.black[3],
    paddingHorizontal: space[2],
    paddingVertical: space[1],
    gap: space[1],
    marginRight: space[2],
  }),
);

const Image = styled(FastImage)(({ theme: { space, borderRadius } }) => ({
  width: space[4],
  height: space[4],
  borderRadius: borderRadius.full,
}));

const ButtonChip = ({
  icon,
  label,
  style,
  onPress,
  imageSrc,
  styleImage,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Container style={style}>
        {icon && icon}
        {imageSrc && (
          <Image
            source={imageSrc}
            style={{ ...styleImage }}
            resizeMode="cover"
          />
        )}
        <SmallLabel fontWeight="normal">{label}</SmallLabel>
      </Container>
    </TouchableOpacity>
  );
};

export default ButtonChip;
