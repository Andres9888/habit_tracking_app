/**
 * TemplateCardContent Types
 */

import type { GestureResponderEvent, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

export interface TemplateCardContentProps {
  category?: string;
  checkmarkStyle: AnimatedStyle<ViewStyle>;
  description: string;
  frequency?: string;
  icon: string;
  iconColor: string;
  isImported: boolean;
  isImporting: boolean;
  isLocked: boolean;
  isPremium: boolean;
  name: string;
  onImportPress: (e: GestureResponderEvent) => void;
  onPreview?: () => void;
  popularityScore?: number;
  scientificLink?: string;
  scientificReference: string;
  showPreviewCTA: boolean;
  usageCount?: number;
  youtubeLink?: string;
}
