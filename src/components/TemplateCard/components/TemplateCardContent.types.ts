/**
 * TemplateCardContent Types
 */

import type { ViewStyle } from 'react-native';
import type { AnimatedStyleProp } from 'react-native-reanimated';

export interface TemplateCardContentProps {
  category?: string;
  checkmarkStyle: AnimatedStyleProp<ViewStyle>;
  description: string;
  frequency?: string;
  icon: string;
  iconColor: string;
  isImported: boolean;
  isImporting: boolean;
  isLocked: boolean;
  isPremium: boolean;
  name: string;
  onImportPress: (e: unknown) => void;
  onPreview?: () => void;
  popularityScore?: number;
  scientificLink?: string;
  scientificReference: string;
  showPreviewCTA: boolean;
  youtubeLink?: string;
}
