/**
 * Types for MilestoneGallery component
 */

import type { GalleryMilestone } from './constants';

/** A single milestone achievement record stored in AsyncStorage */
export interface MilestoneAchievement {
  /** Days milestone (7, 14, 30, 60, 100, 365) */
  days: number;
  /** ISO date string when achieved */
  dateAchieved: string;
  /** Display-friendly habit name */
  habitName: string;
  /** Habit emoji icon */
  habitEmoji: string;
  /** Habit id */
  habitId: string;
}

/** A milestone card's display state */
export interface MilestoneCardData {
  milestone: GalleryMilestone;
  achieved: boolean;
  achievement?: MilestoneAchievement;
}

/** Props for MilestoneGallery */
export interface MilestoneGalleryProps {
  /** Whether the gallery modal is visible */
  visible: boolean;
  /** Close callback */
  onClose: () => void;
}

/** Props for MilestoneCard */
export interface MilestoneCardProps {
  data: MilestoneCardData;
  /** Animation stagger delay in ms */
  delay?: number;
  /** Tap handler (only fires for achieved milestones) */
  onReplay?: (data: MilestoneCardData) => void;
}

/** Hook return */
export interface UseMilestoneGalleryDataReturn {
  cards: MilestoneCardData[];
  isLoading: boolean;
  achievedCount: number;
}
