/**
 * ActionButtons Types
 */

import type { ViewStyle } from 'react-native';
import type { AnimatedStyleProp } from 'react-native-reanimated';

export interface ActionButtonsProps {
  checkmarkStyle: AnimatedStyleProp<ViewStyle>;
  iconColor: string;
  isImported: boolean;
  isImporting: boolean;
  isLocked: boolean;
  name: string;
  onImportPress: (e: unknown) => void;
  onPreview?: () => void;
  showPreviewCTA: boolean;
}
