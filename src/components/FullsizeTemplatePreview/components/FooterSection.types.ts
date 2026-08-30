/**
 * FooterSection Types
 *
 * Props for the template preview footer with import/customize buttons.
 */

import type { SharedValue } from 'react-native-reanimated';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

export interface FooterSectionProps {
  templateName: string;
  isImporting: boolean;
  isImported: boolean;
  bottomInset: number;
  importButtonStyle: object;
  customizeButtonStyle: object;
  checkmarkAnimatedStyle: object;
  successPillStyle: object;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  importButtonScale: SharedValue<number>;
  customizeButtonScale: SharedValue<number>;
  onImport: () => void;
  onCustomize: () => void;
  onGoToToday: () => void;
  onKeepExploring?: () => void;
}
