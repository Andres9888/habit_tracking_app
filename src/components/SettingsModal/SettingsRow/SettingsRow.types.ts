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
  /** Adds a chevron beside string values for inline expandable info rows. */
  showChevron?: boolean;
  /** Overrides the label tint — destructive rows render their label in red. */
  labelColor?: string;
  /**
   * Set on rows that toggle an inline picker open/closed. Rotates the chevron
   * 90deg and announces the expanded state to screen readers. Leave undefined
   * on rows that navigate away — an absent state reads differently from `false`.
   */
  expanded?: boolean;
  /** Override haptic: toggle→Medium, selection→Selection, navigation→Light */
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'selection';
}
