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
  onDismiss?: () => void;
  onViewHabits?: () => void;
  onAddAnother?: () => void;
  style?: ViewStyle;
}
