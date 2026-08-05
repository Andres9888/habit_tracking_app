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
  handleClose: () => void;
  handleBack?: () => void;
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
