import type { ReactNode } from 'react';

export interface SettingsRowProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  subtitle?: string;
  /** Emphasised span rendered inline after `subtitle` — "Every day at **8:00 PM**". */
  subtitleStrong?: string;
  type: 'toggle' | 'navigation' | 'selection' | 'info';
  value?: boolean | string;
  badge?: number;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  /** `type='toggle'` only: makes the icon+label region its own pressable so the
   *  switch stays a separate accessibility node (a switch nested inside a button
   *  is announced twice and traps VoiceOver). Row keeps its unwrapped early
   *  return; `accessibilityHint` becomes the body's hint. Undefined = today. */
  onBodyPress?: () => void;
  /** Custom right-side content — replaces the default type-based accessory */
  rightAccessory?: ReactNode;
  /** Adds a chevron beside string values for inline expandable info rows. */
  showChevron?: boolean;
  /** Overrides the label tint — destructive rows render their label in red. */
  labelColor?: string;
  /** Override haptic: toggle→Medium, selection→Selection, navigation→Light */
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'selection';
  /** Screen-reader label when the visible label is user-specific or incomplete. */
  accessibilityLabel?: string;
  /** Screen-reader guidance for rows that disclose additional controls. */
  accessibilityHint?: string;
  /** Disclosure state for expandable selection/toggle rows. */
  expanded?: boolean;
  /** Prevent interaction and expose the disabled state to assistive technology. */
  disabled?: boolean;
  /** Expose an in-flight action without pretending it is still actionable. */
  busy?: boolean;
}
