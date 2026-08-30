/**
 * Types for PreviewContent
 */

import type { ViewStyle } from 'react-native';
import type { AnimatedStyle, SharedValue } from 'react-native-reanimated';
import type { TemplatePreviewAnchor } from '../../../screens/TemplatesScreen/TemplatesScreen.types';
import type { Template } from '../../../types/template';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

export interface PreviewContentAnimatedStyles {
  contentStyle: AnimatedStyle<ViewStyle>;
  closeButtonAnimatedOpacityStyle: AnimatedStyle<ViewStyle>;
  iconAnimatedStyle: AnimatedStyle<ViewStyle>;
  iconGlowStyle: AnimatedStyle<ViewStyle>;
  checkmarkAnimatedStyle: AnimatedStyle<ViewStyle>;
  customizeButtonStyle: AnimatedStyle<ViewStyle>;
  importButtonStyle: AnimatedStyle<ViewStyle>;
  successPillStyle: AnimatedStyle<ViewStyle>;
}

export interface PreviewContentHandlers {
  /** Exit to the home screen (header X). */
  handleClose: () => void;
  /** Return to the Habit Library (header back). Absent when no library. */
  handleBack?: () => void;
  /** Back when a library is behind us, close otherwise. */
  handleDismiss: () => void;
  /** Post-add primary action — home, focusing the new habit when known. */
  handleGoToHabit: () => void;
  handleCustomize: () => void;
  handleImport: () => void;
}

export interface PreviewContentProps {
  animatedStyles: PreviewContentAnimatedStyles;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  customizeButtonScale: SharedValue<number>;
  handlers: PreviewContentHandlers;
  importButtonScale: SharedValue<number>;
  insets: { top: number; bottom: number };
  initialAnchor?: TemplatePreviewAnchor;
  isImported: boolean;
  isImporting: boolean;
  reducedMotion: boolean;
  template: Template;
  visible: boolean;
}
