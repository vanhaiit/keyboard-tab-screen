import styled from '@emotion/native';
import { TextProps as RNTextProps } from 'react-native';

export type FontWeight = 'normal' | 'medium' | 'bold' | 'black';

export interface TextProps extends RNTextProps {
  fontWeight?: FontWeight;
  italic?: boolean;
  color?: string;
}

export const getFontFamily = (
  fontWeight: FontWeight = 'normal',
  italic = false,
): string => {
  switch (fontWeight) {
    case 'normal':
      return italic ? 'Montserrat-Italic' : 'Montserrat-Regular';
    case 'medium':
      return italic ? 'Montserrat-MediumItalic' : 'Montserrat-Medium';
    case 'bold':
      return italic ? 'Montserrat-BoldItalic' : 'Montserrat-Bold';
    case 'black':
      return italic ? 'Montserrat-BlackItalic' : 'Montserrat-Black';
    default:
      return italic ? 'Montserrat-Italic' : 'Montserrat-Regular';
  }
};

export const Text = styled.Text<TextProps>`
  font-family: ${props => getFontFamily(props.fontWeight, props.italic)};
  color: ${({ color, theme }) => color ?? theme.colors.palette.white};
`;

export const H1 = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h1.fontSize.toString()}px;
  line-height: ${({ theme }) => theme.typography.h1.lineHeight.toString()}px;
`;

export const H2 = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h2.fontSize.toString()}px;
  line-height: ${({ theme }) => theme.typography.h2.lineHeight.toString()}px;
`;

export const H3 = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h3.fontSize.toString()}px;
  line-height: ${({ theme }) => theme.typography.h3.lineHeight.toString()}px;
`;

export const H4 = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h4.fontSize.toString()}px;
  line-height: ${({ theme }) => theme.typography.h4.lineHeight.toString()}px;
`;

export const H5 = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h5.fontSize.toString()}px;
  line-height: ${({ theme }) => theme.typography.h5.lineHeight.toString()}px;
`;

export const Body = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body1.fontSize.toString()}px;
  line-height: ${({ theme }) => theme.typography.body1.lineHeight.toString()}px;
`;

export const LargeLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body3.fontSize.toString()}px;
  line-height: ${({ theme }) => theme.typography.body3.lineHeight.toString()}px;
`;

export const SmallBody = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body2.fontSize.toString()}px;
  line-height: ${({ theme }) => theme.typography.body2.lineHeight.toString()}px;
`;

export const Label = styled(Text)`
  font-size: ${({ theme }) => theme.typography.label.fontSize.toString()}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight.toString()}px;
`;

export const SmallLabel = styled(Text)`
  font-size: ${({ theme }) =>
    theme.typography.smallLabel.fontSize.toString()}px;
  line-height: ${({ theme }) =>
    theme.typography.smallLabel.lineHeight.toString()}px;
`;

export const TinyLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.tinyLabel.fontSize.toString()}px;
  line-height: ${({ theme }) =>
    theme.typography.tinyLabel.lineHeight.toString()}px;
`;
