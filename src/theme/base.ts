import { Dimensions } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { scale, horizontalScale } from './helper';
import styles from './styles';

const sizeBase = scale(4);
const horizontalSizeBase = horizontalScale(4);
export const sizes = [...Array(96).keys()].map(size => size * sizeBase);
export const horizontalSpace = [...Array(96).keys()].map(
  size => size * horizontalSizeBase,
);

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

const elevation = [
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
];

const base = {
  horizontalSpace,
  typography,
  colors: {
    // main
    ...colors,
    primary: colors.black[2],
    secondary: colors.black[3],
    background: colors.black[4],

    palette: colors,
  },
  sizes,
  space: sizes,
  borderRadius: {
    none: 0,
    'xs-small': 2,
    'x-small': 4,
    'xx-small': 6,
    small: 8,
    medium: 10,
    large: 16,
    'x-large': 20,
    'xx-large': 30,
    full: 9999,
  },
  scale,
  getElevation: (level: number) => {
    'worklet';
    return {
      shadowColor: elevation[level].shadowColor,
      shadowOffset: {
        width: elevation[level].shadowOffset.width,
        height: elevation[level].shadowOffset.height,
      },
      shadowOpacity: elevation[level].shadowOpacity,
      shadowRadius: elevation[level].shadowRadius,
      elevation: elevation[level].elevation,
    };
  },

  elevation: JSON.parse(JSON.stringify(elevation)),
  opacity: {
    default: 1,
    disabled: 0.5,
  },
  animation: {
    duration: 500,
    chartsLayout: {
      duration: 1500,
    },
    searchBar: {
      duration: 200,
    },
  },
  window: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  styles,
};

export type BaseType = typeof base;
export type RadiusType = keyof typeof base.borderRadius;

export default base;
