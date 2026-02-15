/**
 * Type definitions for FullsizeTemplatePreview component
 */

import type { SharedValue } from 'react-native-reanimated';

import type { Doc, Id } from '../../../convex/_generated/dataModel';

/** Props for the main FullsizeTemplatePreview component */
export interface FullsizeTemplatePreviewProps {
  /** Template to preview */
  template: Doc<'templates'> | null;
  /** Modal visibility */
  visible: boolean;
  /** Close handler */
  onClose: () => void;
  /** Direct import handler (skips customization) */
  onImport: (templateId: Id<'templates'>) => void;
  /** Customize handler (opens existing TemplatePreviewModal) */
  onCustomize: (template: Doc<'templates'>) => void;
  /** Loading state for import */
  isImporting?: boolean;
  /** Has been successfully imported */
  isImported?: boolean;
}

/** Press handler interface for animated buttons */
export interface PressHandlers {
  onPressIn: () => void;
  onPressOut: () => void;
}

/** Animation values for entrance animations */
export interface EntranceAnimationValues {
  backdropOpacity: SharedValue<number>;
  contentTranslateY: SharedValue<number>;
  contentOpacity: SharedValue<number>;
  iconScale: SharedValue<number>;
  iconGlowScale: SharedValue<number>;
  iconGlowOpacity: SharedValue<number>;
  closeButtonOpacity: SharedValue<number>;
}

/** Animation values for success state */
export interface SuccessAnimationValues {
  successGlow: SharedValue<number>;
  successGlowScale: SharedValue<number>;
  checkmarkScale: SharedValue<number>;
  checkmarkRotation: SharedValue<number>;
  successButtonGlow: SharedValue<number>;
  successIconBounce: SharedValue<number>;
}

/** Button scale values for press feedback */
export interface ButtonScaleValues {
  closeButton: SharedValue<number>;
  importButton: SharedValue<number>;
  customizeButton: SharedValue<number>;
}

/** Props for HeroSection component */
export interface HeroSectionProps {
  template: Doc<'templates'>;
  iconColor: string;
  iconAnimatedStyle: object;
  iconGlowStyle: object;
}

/** Props for ScienceBox component */
export interface ScienceBoxProps {
  template: Doc<'templates'>;
  onResearchPress: () => void;
}

/** Props for TipsBox component */
export interface TipsBoxProps {
  tips: string[];
  iconColor: string;
}

/** Props for FooterSection component */
export interface FooterSectionProps {
  template: Doc<'templates'>;
  iconColor: string;
  isImporting: boolean;
  isImported: boolean;
  importButtonStyle: object;
  customizeButtonStyle: object;
  checkmarkAnimatedStyle: object;
  successButtonGlowStyle: object;
  successIconBounceStyle: object;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  importButtonScale: SharedValue<number>;
  customizeButtonScale: SharedValue<number>;
  onImport: () => void;
  onCustomize: () => void;
}
