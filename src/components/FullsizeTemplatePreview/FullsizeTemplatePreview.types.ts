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
  /**
   * Exit the whole flow to the home screen — the header X. Callers are
   * expected to dismiss the library behind the preview too, not just this
   * modal.
   */
  onClose: () => void;
  /**
   * Return to the Habit Library — the header back button, and where implicit
   * dismissals (hardware back, backdrop) resolve. When omitted the back
   * control is hidden and dismissals fall through to `onClose`.
   */
  onBack?: () => void;
  /** Direct import handler (skips customization) */
  onImport: (templateId: Id<'templates'>) => void;
  /** Customize handler (opens existing TemplatePreviewModal) */
  onCustomize: (template: Doc<'templates'>) => void;
  /** Loading state for import */
  isImporting?: boolean;
  /** Has been successfully imported */
  isImported?: boolean;
  /**
   * The habit this template produced, when known. Unknown (null/undefined) is
   * expected — e.g. the imported-habit map has not resolved yet — and makes the
   * post-add primary action fall back to `onClose`.
   */
  importedHabitId?: Id<'habits'> | null;
  /**
   * Post-add primary action: leave for home and focus the habit there. Falls
   * back to `onClose` when absent or when `importedHabitId` is unknown.
   */
  onGoToHabit?: (habitId: Id<'habits'>) => void;
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
  successPanelProgress: SharedValue<number>;
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
