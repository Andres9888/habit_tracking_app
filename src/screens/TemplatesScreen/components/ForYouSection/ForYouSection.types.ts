/**
 * Type definitions for the ForYouSection component.
 *
 * The "For You" section uses Mere Exposure (Zajonc, 1968) and
 * Common Region (Palmer, 1992) principles to reduce choice paralysis.
 */

import type { Doc } from '../../../../../convex/_generated/dataModel';

/** A single recommendation with its behavioral science connection cue */
export interface ForYouRecommendation {
  /** The highlighted lead phrase (e.g., "Complements", "78% of readers") */
  cueHighlight: string;
  /** Full connection cue text linking to user's existing habits */
  connectionCue: string;
  /** The recommended template */
  template: Doc<'templates'>;
}

export interface ForYouSectionProps {
  /** Set of already-imported template IDs (shows check state) */
  importedIds: Set<string>;
  /** Set of currently-importing template IDs (shows spinner) */
  importingIds: Set<string>;
  /** Handler for 1-tap import */
  onImport: (template: Doc<'templates'>) => void;
  /** Handler for card press (opens fullsize preview) */
  onPreview: (template: Doc<'templates'>) => void;
  /** Personalized recommendations from the recommendation engine */
  recommendations: ForYouRecommendation[];
}

export interface ForYouCardProps {
  /** The highlighted lead phrase */
  cueHighlight: string;
  /** Full connection cue text */
  connectionCue: string;
  /** Template emoji icon */
  icon: string;
  /** Background tint color for the icon area */
  iconColor: string;
  /** Whether already imported */
  isImported: boolean;
  /** Whether import is in progress */
  isImporting: boolean;
  /** Template name */
  name: string;
  /** 1-tap import handler */
  onImport: () => void;
  /** Card body press handler */
  onPress: () => void;
}
