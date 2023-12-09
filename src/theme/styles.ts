import { TextStyle, ViewStyle } from 'react-native';

const styles: { [key: string]: ViewStyle & TextStyle } = {
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
  },
};

export default styles;
