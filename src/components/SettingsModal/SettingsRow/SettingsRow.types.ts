import type { ReactNode } from 'react';

export interface SettingsRowProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  subtitle?: string;
  type: 'toggle' | 'navigation' | 'selection' | 'info';
  value?: boolean | string;
  badge?: number;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  /** Custom right-side content — replaces the default type-based accessory */
  rightAccessory?: ReactNode;
  showBorder?: boolean;
  highContrastMode?: boolean;
  /** Override haptic: toggle→Medium, selection→Selection, navigation→Light */
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'selection';
}
