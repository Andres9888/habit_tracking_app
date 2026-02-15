/**
 * ActionButtons Types
 */

import type { AnimatedStyle } from 'react-native-reanimated';
import type { GestureResponderEvent, ViewStyle } from 'react-native';

export interface ActionButtonsProps {
  checkmarkStyle: AnimatedStyle<ViewStyle>;
  iconColor: string;
  isImported: boolean;
  isImporting: boolean;
  isLocked: boolean;
  name: string;
  onImportPress: (e: GestureResponderEvent) => void;
  onPreview?: () => void;
  showPreviewCTA: boolean;
}
