/**
 * Types for PreviewContent
 */

import type { ViewStyle } from 'react-native';
import type ConfettiCannon from 'react-native-confetti-cannon';
import type { SharedValue } from 'react-native-reanimated';
import type { Template } from '../../../types/template';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

export interface PreviewContentAnimatedStyles {
  contentStyle: ViewStyle;
  successGlowStyle: ViewStyle;
  closeButtonAnimatedOpacityStyle: ViewStyle;
  iconAnimatedStyle: ViewStyle;
  iconGlowStyle: ViewStyle;
  checkmarkAnimatedStyle: ViewStyle;
  customizeButtonStyle: ViewStyle;
  importButtonStyle: ViewStyle;
  successButtonGlowStyle: ViewStyle;
  successIconBounceStyle: ViewStyle;
}

export interface PreviewContentHandlers {
  handleClose: () => void;
  handleBack?: () => void;
  handleCustomize: () => void;
  handleImport: () => void;
}

export interface PreviewContentProps {
  animatedStyles: PreviewContentAnimatedStyles;
  confettiRef: React.RefObject<ConfettiCannon | null>;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  customizeButtonScale: SharedValue<number>;
  handlers: PreviewContentHandlers;
  iconColor: string;
  importButtonScale: SharedValue<number>;
  insets: { top: number; bottom: number };
  isImported: boolean;
  isImporting: boolean;
  reducedMotion: boolean;
  template: Template;
}
