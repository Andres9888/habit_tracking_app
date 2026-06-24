import type { ReactNode } from 'react';

/** Optional contextual help shown via a quiet (?) affordance beside the label. */
export interface RowHelp {
  title: string;
  body: string;
}

export interface SettingsRowProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  subtitle?: string;
  /** When set, renders a tappable (?) icon after the label explaining the row. */
  help?: RowHelp;
  type: 'toggle' | 'navigation' | 'selection' | 'info';
  value?: boolean | string;
  badge?: number;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  /** Custom right-side content — replaces the default type-based accessory */
  rightAccessory?: ReactNode;
  showBorder?: boolean;
  /** Override haptic: toggle→Medium, selection→Selection, navigation→Light */
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'selection';
}
