import styled from '@emotion/native';
import React from 'react';
import FastImage, { Source } from 'react-native-fast-image';
import { useTheme } from '@emotion/react';
import { ViewProps } from 'react-native';

const Container = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.black[0],
  borderRadius: theme.borderRadius.full,
}));

const CircleBox = styled.Pressable(({ theme }) => ({
  position: 'absolute',
  bottom: -10,
  right: 0,
  height: 20,
  width: 20,
  borderRadius: theme.borderRadius.full,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

interface Props extends ViewProps {
  size: number;
  miniTagIcon?: React.ReactNode;
  onPress?: () => void;
  url?: string;
  defaultSource?: Source;
}

const Avatar = ({ size, miniTagIcon, url, defaultSource }: Props) => {
  const theme = useTheme();
  return (
    <Container
      style={{
        width: size,
        height: size,
        marginBottom: miniTagIcon ? 10 : 0, //center vertical img with miniTagIcon
      }}>
      <FastImage
        source={
          url
            ? {
                uri: url,
              }
            : defaultSource
        }
        resizeMode={'cover'}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: theme.borderRadius.full,
        }}
      />
      {miniTagIcon && <CircleBox>{miniTagIcon}</CircleBox>}
    </Container>
  );
};

export default Avatar;
