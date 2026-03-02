import type { ReactNode } from 'react';

export type ScreenHeaderLeftAction = 'back' | 'close' | ReactNode;

export type ScreenHeaderVariant = 'default' | 'transparent';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: ScreenHeaderLeftAction;
  rightAction?: ReactNode;
  variant?: ScreenHeaderVariant;
  onBack?: () => void;
}
