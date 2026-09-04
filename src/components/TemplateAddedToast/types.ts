/**
 * Type definitions for TemplateAddedToast
 */

import type { ViewStyle } from 'react-native';

export interface TemplateToastData {
  color: string;
  icon: string;
  name: string;
}

export interface TemplateAddedToastProps {
  /** False while import is pending and no real habit id exists yet. */
  actionReady?: boolean;
  visible: boolean;
  templateData: TemplateToastData | null;
  duration?: number;
  variant?: 'success' | 'already_exists';
  sessionImportCount?: number;
  onDismiss?: () => void;
  onViewHabit?: () => void;
  onAddAnother?: () => void;
  /** Accessibility hint for the primary "Go to <name>" action. */
  primaryHint?: string;
  /** Secondary action copy; defaults to the Habit Library's "Keep exploring". */
  secondaryLabel?: string;
  secondaryHint?: string;
  /** @deprecated use onViewHabit */
  onViewHabits?: () => void;
  style?: ViewStyle;
}
