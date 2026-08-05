/**
 * FooterSection Types
 *
 * Props for the template preview footer with import/customize buttons.
 */

import type { SharedValue } from 'react-native-reanimated';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

export interface FooterSectionProps {
  templateName: string;
  iconColor: string;
  isImporting: boolean;
  isImported: boolean;
  bottomInset: number;
  customizeButtonStyle: object;
  checkmarkAnimatedStyle: object;
  successPillStyle: object;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  customizeButtonScale: SharedValue<number>;
  reducedMotion: boolean;
  onImport: () => void;
  onCustomize: () => void;
}
