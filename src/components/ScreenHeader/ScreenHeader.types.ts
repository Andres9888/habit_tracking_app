import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

export type ScreenHeaderLeftAction = 'back' | 'close' | ReactNode;

export type ScreenHeaderVariant = 'default' | 'transparent';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: ScreenHeaderLeftAction;
  rightAction?: ReactNode;
  variant?: ScreenHeaderVariant;
  titleVisible?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  titleNumberOfLines?: number;
  /** Spoken label for the built-in back/close control. */
  leftActionAccessibilityLabel?: string;
  onBack?: () => void;
}
