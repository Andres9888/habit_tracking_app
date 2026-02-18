/**
 * Types for MiniCardContainer
 */

import type { ViewStyle } from 'react-native';

export interface MiniCardContainerProps {
  name: string;
  subtitle?: string;
  description?: string;
  icon: string;
  iconColor: string;
  hasResearch?: boolean;
  isImporting?: boolean;
  isImported?: boolean;
  animatedCardStyle: ViewStyle;
  glowStyle: ViewStyle;
  chevronStyle: ViewStyle;
  scienceBadgeStyle: ViewStyle;
  importButtonStyle: ViewStyle;
  checkmarkStyle: ViewStyle;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onImport?: () => void;
}
