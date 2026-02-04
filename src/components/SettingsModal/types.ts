/* eslint-disable max-lines */
/**
 * Settings Modal Types
 *
 * Complete TypeScript types for Settings v2 components.
 */

import type { ReactNode } from 'react';

// Icon color variants for SettingsRow
export const ICON_COLORS = {
  blue: 'rgba(59, 130, 246, 0.2)',
  cyan: 'rgba(34, 211, 238, 0.2)',
  gray: 'rgba(107, 114, 128, 0.2)',
  green: 'rgba(34, 197, 94, 0.2)',
  indigo: 'rgba(99, 102, 241, 0.2)',
  orange: 'rgba(249, 115, 22, 0.2)',
  pink: 'rgba(236, 72, 153, 0.2)',
  purple: 'rgba(139, 92, 246, 0.2)',
  red: 'rgba(239, 68, 68, 0.2)',
  yellow: 'rgba(234, 179, 8, 0.2)',
} as const;

export type IconColorVariant = keyof typeof ICON_COLORS;

// Settings row types
export interface SettingsRowBaseProps {
  icon: string;
  iconColor: IconColorVariant;
  label: string;
  description?: string;
  badge?: 'pro' | 'new';
  disabled?: boolean;
  isFirst?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface SettingsRowNavigationProps extends SettingsRowBaseProps {
  type: 'navigation' | 'action';
  value?: string;
  onPress: () => void;
}

export interface SettingsRowToggleProps extends SettingsRowBaseProps {
  type: 'toggle';
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export type SettingsRowProps =
  | SettingsRowNavigationProps
  | SettingsRowToggleProps;

// Section types
export interface SettingsSectionProps {
  title: string;
  icon?: string;
  variant?: 'default' | 'danger';
  index?: number;
  children: ReactNode;
}

// Account card types
export interface UserAccountCardProps {
  user: {
    name: string;
    email: string;
    avatarInitial: string;
  };
  subscription: 'free' | 'pro' | 'trial';
  onManageSubscription: () => void;
  onSignOut: () => void;
  isSigningOut?: boolean;
}

// Delete modal types
export interface DeleteAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  stats: {
    habitsCount: number;
    totalDays: number;
  };
  isLoading?: boolean;
}

// Settings header types
export interface SettingsHeaderProps {
  onClose: () => void;
  paddingTop?: number;
}

// Grid selector types
export interface SettingsGridOption {
  id: string;
  emoji: string;
  label: string;
}

export interface SettingsGridProps {
  options: SettingsGridOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  columns?: 3 | 4;
}

// Main modal props
export interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  // Visual preferences
  dayShape?: 'circle' | 'square';
  habitCompletionIcon?: 'chain' | 'checkbox';
  showWeekCompletionBar?: boolean;
  onChangeDayShape?: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeHabitCompletionIcon?: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeShowWeekCompletionBar?: (value: boolean) => void | Promise<void>;
  isHighContrastActive?: boolean;
}

// Settings content props
export interface SettingsContentProps {
  // Visual preferences
  dayShape: 'circle' | 'square';
  habitCompletionIcon: 'chain' | 'checkbox';
  showWeekCompletionBar: boolean;
  onChangeDayShape: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeHabitCompletionIcon: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeShowWeekCompletionBar: (value: boolean) => void | Promise<void>;
  // Navigation
  onOpenArchivedHabits: () => void;
  onClose: () => void;
}

// Color tokens for theming
export interface SettingsColors {
  background: string;
  backgroundGradientEnd: string;
  card: string;
  cardBorder: string;
  cardDanger: string;
  cardDangerBorder: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDanger: string;
  accent: string;
  accentSecondary: string;
  success: string;
  warning: string;
  danger: string;
}

// Default dark theme colors
export const SETTINGS_COLORS: SettingsColors = {
  background: '#0f0f23',
  accent: '#6366f1',
  backgroundGradientEnd: '#1a1a3e',
  accentSecondary: '#8b5cf6',
  card: 'rgba(255, 255, 255, 0.04)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
  cardDanger: 'rgba(239, 68, 68, 0.08)',
  cardDangerBorder: 'rgba(239, 68, 68, 0.2)',
  danger: '#ef4444',
  success: '#22c55e',
  textDanger: '#f87171',
  textPrimary: '#ffffff',
  textSecondary: '#8b8ba7',
  textTertiary: '#6b7280',
  warning: '#f59e0b',
};
