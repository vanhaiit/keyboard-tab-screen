import styled from '@emotion/native';
import React from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface ILoading extends ActivityIndicatorProps {
  styleContainer?: StyleProp<ViewStyle>;
}

const Loading: React.FC<ILoading> = ({ styleContainer, ...props }) => {
  return (
    <LoadingContainer style={styleContainer}>
      <ActivityIndicator size="small" color="#ffff" {...props} />
    </LoadingContainer>
  );
};

export default Loading;

const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));
