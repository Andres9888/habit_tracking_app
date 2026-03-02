/**
 * ActionButtons Types
 */

import type { GestureResponderEvent, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

export interface ActionButtonsProps {
  checkmarkStyle: AnimatedStyle<ViewStyle>;
  iconColor: string;
  index?: number;
  isImported: boolean;
  isImporting: boolean;
  isLocked: boolean;
  name: string;
  onImportPress: (e: GestureResponderEvent) => void;
  onPreview?: () => void;
  showPreviewCTA: boolean;
}
