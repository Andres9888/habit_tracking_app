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
  /**
   * Play the fade-in-down entrance on mount (default true). Headers mounted
   * inside an RN Modal should pass false: the Modal already animates in, and an
   * entering animation interrupted mid-flight there (cold-start opens) leaves
   * the header frozen at opacity 0.
   */
  animateEntrance?: boolean;
  onBack?: () => void;
}
