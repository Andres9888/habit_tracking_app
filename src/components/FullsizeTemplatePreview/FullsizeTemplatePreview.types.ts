/**
 * Type definitions for FullsizeTemplatePreview component
 */

import type { SharedValue } from 'react-native-reanimated';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { TemplatePreviewAnchor } from '../../screens/TemplatesScreen/TemplatesScreen.types';

/** Props for the main FullsizeTemplatePreview component */
export interface FullsizeTemplatePreviewProps {
  /** Template to preview */
  template: Doc<'templates'> | null;
  /** Modal visibility */
  visible: boolean;
  /** Scroll target on open */
  initialAnchor?: TemplatePreviewAnchor;
  /** Close handler — called when the X button is tapped */
  onClose: () => void;
  /** Optional back handler — when provided, a back button is rendered in the header */
  onBack?: () => void;
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
  checkmarkScale: SharedValue<number>;
  successPillScale: SharedValue<number>;
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
  successPillStyle: object;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  importButtonScale: SharedValue<number>;
  customizeButtonScale: SharedValue<number>;
  onImport: () => void;
  onCustomize: () => void;
}
