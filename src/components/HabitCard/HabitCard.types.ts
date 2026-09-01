/**
 * HabitCard Types
 * Type definitions for the HabitCard component
 *
 * @see docs/offline-habit-sync.md T013 - Offline state support
 * @see docs/offline-habit-sync.md T014 - Chain animation for offline completions
 */

import type { ViewStyle } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import type { TrackingRecord } from '../../lib/offline/calculations';
import type { HabitCardEntranceVariant } from './useHabitCardEntrance';

/** Completion icon type - chain link for visual "chain building" or checkbox */
export type CompletionIconType = 'chain' | 'checkbox';

export interface HabitCardProps {
  /** Habit ID */
  id: Id<'habits'>;

  /** Habit name */
  name: string;

  /** Habit icon/emoji */
  icon?: string;

  /** Habit color (hex) */
  color?: string;

  /** Habit strength (0-100) */
  strength: number;

  /** Current streak (Story 1.4) */
  currentStreak?: number;

  /** Best streak (Story 1.4) */
  bestStreak?: number;

  /** Is completed today */
  completed?: boolean;

  /** Is at risk (prediction <40%) */
  atRisk?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** On tap handler (complete habit) - DEPRECATED: Component now calls toggleCompletion mutation directly */
  onPress?: () => void;

  /** On long press handler (quick actions menu) */
  onLongPress?: () => void;

  /** On edit handler (swipe action) */
  onEdit?: () => void;

  /** On delete handler (swipe action) */
  onDelete?: () => void;

  /** Custom style */
  style?: ViewStyle;

  /**
   * Animation variant for card entrance.
   * @default 'accentSlideDown'
   */
  entranceVariant?: HabitCardEntranceVariant;

  /**
   * Delay before entrance animation starts (for stagger effects).
   * @default 0
   */
  entranceDelay?: number;

  /**
   * Whether to trigger entrance animation on mount.
   * Set to false to manually trigger via triggerEntrance callback.
   * @default true
   */
  triggerEntrance?: boolean;

  /**
   * Callback fired when entrance animation completes.
   */
  onEntranceComplete?: () => void;

  /**
   * Server-side tracking records for offline streak calculation.
   * When provided with offlineSyncEnabled, enables offline-aware
   * streak and completion display.
   *
   * @see docs/offline-habit-sync.md T013
   */
  serverTracking?: TrackingRecord[];

  /**
   * Enable offline sync integration for this habit card.
   * When true, the card will merge server state with pending
   * offline operations for accurate display.
   *
   * @default false
   * @see docs/offline-habit-sync.md T013
   */
  offlineSyncEnabled?: boolean;

  /**
   * Type of completion icon to display.
   * - 'chain': Shows chain link icon with linking animation (for "don't break the chain")
   * - 'checkbox': Shows checkmark icon (traditional checkbox style)
   *
   * @default 'checkbox'
   * @see docs/offline-habit-sync.md T014
   */
  completionIcon?: CompletionIconType;
}
