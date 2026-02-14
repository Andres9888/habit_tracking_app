/**
 * Type definitions for MiniTemplateCard component
 */

export interface MiniTemplateCardProps {
  /** Template icon/emoji */
  icon: string;
  /** Template icon background color */
  iconColor: string;
  /** Template name */
  name: string;
  /** Template description */
  description?: string;
  /** Short description or frequency */
  subtitle?: string;
  /** Has scientific backing */
  hasResearch?: boolean;
  /** Scientific reference text */
  scientificReference?: string;
  /** Tap handler for preview */
  onPress: () => void;
  /** Import handler */
  onImport?: () => void;
  /** Is currently importing */
  isImporting?: boolean;
  /** Has been successfully imported */
  isImported?: boolean;
  /** Is premium template */
  isPremium?: boolean;
}

export interface AnimationValues {
  pressScale: { value: number };
  pressRotation: { value: number };
  shadowElevation: { value: number };
  buttonPulse: { value: number };
  checkmarkScale: { value: number };
  successGlow: { value: number };
  chevronTranslate: { value: number };
  scienceBadgePulse: { value: number };
}
