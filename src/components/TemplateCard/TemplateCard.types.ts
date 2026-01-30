/**
 * TemplateCard Types
 *
 * Type definitions for the TemplateCard component
 */

import type { ViewStyle } from 'react-native';

export interface TemplateCardProps {
  /** Animation index for staggered entrance */
  animationIndex?: number;

  /** Category badge */
  category?: string;

  /** Enable scroll reveal animation (cards animate in when entering viewport) */
  enableScrollReveal?: boolean;

  /** Template description */
  description: string;

  /** Optional frequency label */
  frequency?: string;

  /** Does user have access to premium? */
  hasAccess?: boolean;

  /** Template icon/emoji */
  icon: string;

  /** Template icon background color */
  iconColor: string;

  /** Template ID */
  id: string;

  /** Has been successfully imported */
  isImported?: boolean;

  /** Loading flag for import mutation */
  isImporting?: boolean;

  /** Is this a premium template? */
  isPremium?: boolean;

  /** Template name */
  name: string;

  /** On import handler */
  onImport: () => void;

  /** On preview handler (tap card) */
  onPreview?: () => void;

  /** On upgrade handler (for premium templates) */
  onUpgrade?: () => void;

  /** Popularity score (optional) */
  popularityScore?: number;

  /** Optional scientific link */
  scientificLink?: string;

  /** Scientific reference citation */
  scientificReference: string;

  /** Should preview CTA render */
  showPreviewCTA?: boolean;

  /** Custom style */
  style?: ViewStyle;

  /** Optional YouTube video link */
  youtubeLink?: string;
}

/** Props for the TemplateCardRender component */
export type TemplateCardRenderProps = Pick<
  TemplateCardProps,
  | 'category'
  | 'description'
  | 'enableScrollReveal'
  | 'frequency'
  | 'icon'
  | 'isImported'
  | 'isImporting'
  | 'isPremium'
  | 'name'
  | 'onPreview'
  | 'popularityScore'
  | 'scientificLink'
  | 'scientificReference'
  | 'showPreviewCTA'
  | 'style'
  | 'youtubeLink'
> & {
  reducedMotion: boolean;
  isLocked: boolean;
  iconColor: string;
  containerStyle: any;
  glowStyle: any;
  shadowStyle: any;
  checkmarkStyle: any;
  handleCardPress: () => void;
  handleImportPress: () => void;
  handlePressIn: () => void;
  handlePressOut: () => void;
};
