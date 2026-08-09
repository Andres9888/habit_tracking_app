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
  /** Shown under the Add CTA while deciding; omitted once imported. */
  startSmallVersion?: string;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  importButtonScale: SharedValue<number>;
  customizeButtonScale: SharedValue<number>;
  onImport: () => void;
  onCustomize: () => void;
  /** Post-add exit — the page has nothing left to offer once the habit is in. */
  onDone: () => void;
}
