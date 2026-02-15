/**
 * Types for PreviewContent
 */

import type { SharedValue } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

import type { PressHandlers } from '../FullsizeTemplatePreview.types';
import type { Template } from '../../../types/template';

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
  handleCustomize: () => void;
  handleImport: () => void;
  handleResearchPress: () => void;
}

export interface PreviewContentProps {
  animatedStyles: PreviewContentAnimatedStyles;
  confettiRef: React.RefObject<any>;
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
