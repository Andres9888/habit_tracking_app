/**
 * SpotlightHero Types
 * Type definitions for the spotlight hero component
 */

import type { Doc } from '../../../convex/_generated/dataModel';

export interface SpotlightHeroProps {
  /** Featured template to display */
  template: Doc<'templates'>;
  /** Handler for preview action */
  onPreview: () => void;
  /** Handler for import action */
  onImport: () => void;
  /** Loading state for import */
  isImporting?: boolean;
  /** Animation delay for staggered entrance */
  animationDelay?: number;
}

export interface GradientColors {
  start: string;
  middle: string;
  end: string;
}
