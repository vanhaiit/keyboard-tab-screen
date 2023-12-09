import '@emotion/react';
import { AppTheme } from './index';

declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}
