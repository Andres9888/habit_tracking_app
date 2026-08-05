import type React from 'react';
import type { StyleProp, ViewStyle, TextStyle, PressableProps } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Button content (text or icon) */
  children: React.ReactNode;

  /** Button variant */
  variant?: ButtonVariant;

  /** Button size */
  size?: ButtonSize;

  /** Loading state - shows spinner */
  loading?: boolean;

  /** Icon to display (for icon variant or alongside text) */
  icon?: React.ReactNode;

  /** Icon position (left or right of text) */
  iconPosition?: 'left' | 'right';

  /** Full width button */
  fullWidth?: boolean;

  /** Custom styles */
  style?: StyleProp<ViewStyle>;

  /** Custom text styles */
  textStyle?: TextStyle;
}

export interface SizeConfig {
  height: number;
  paddingHorizontal: number;
  fontSize: number;
  fontFamily: string;
  iconSize: number;
}

export interface VariantStyles {
  container: ViewStyle;
  text: TextStyle;
}
