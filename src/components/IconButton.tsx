import React from 'react';
import Row from '@/components/Row';

import { H4 } from '@/components/Typography';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';
import { SvgProps } from 'react-native-svg';
import FastImage, { Source } from 'react-native-fast-image';
import { TouchableOpacity, ViewProps } from 'react-native';

type Props = ViewProps & {
  LeftIcon?: React.FC<SvgProps>;
  leftImageSrc?: Source;
  label: string;
  onPress?: () => void;
};

const Container = styled(Row)(
  ({ theme: { space, colors, borderRadius, horizontalSpace } }) => ({
    borderRadius: borderRadius.medium,
    backgroundColor: colors.whiteTransparent[1],
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[3],
    gap: space[2],
    marginRight: space[2],
    marginTop: space[2],
  }),
);

const IconButton = ({
  LeftIcon,
  label,
  leftImageSrc,
  style,
  onPress,
}: Props) => {
  const { space, colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <Container style={style}>
        {LeftIcon && (
          <LeftIcon width={space[6]} color={colors.white} height={space[6]} />
        )}
        {leftImageSrc && (
          <FastImage
            source={leftImageSrc}
            style={{ width: space[6], height: space[6] }}
            resizeMode="contain"
          />
        )}
        <H4 fontWeight="normal">{label}</H4>
      </Container>
    </TouchableOpacity>
  );
};

export default IconButton;
