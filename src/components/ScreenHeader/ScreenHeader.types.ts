import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

export type ScreenHeaderLeftAction = 'back' | 'close' | ReactElement | null;

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
  onBack?: () => void;
}
