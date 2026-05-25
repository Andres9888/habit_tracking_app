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
  visible: boolean;
  templateData: TemplateToastData | null;
  duration?: number;
  variant?: 'success' | 'already_exists';
  sessionImportCount?: number;
  onDismiss?: () => void;
  onViewHabit?: () => void;
  onAddAnother?: () => void;
  /** @deprecated use onViewHabit */
  onViewHabits?: () => void;
  style?: ViewStyle;
}
