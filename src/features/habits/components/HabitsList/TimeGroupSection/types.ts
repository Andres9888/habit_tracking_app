/**
 * Types for the time-of-day habit grouping feature.
 */

import type { Habit } from '../../../types';

/** Canonical time-of-day groups. */
export type TimeGroup = 'morning' | 'afternoon' | 'evening' | 'anytime';

/** A single group with its habits and metadata. */
export interface HabitTimeGroup {
  key: TimeGroup;
  label: string;
  icon: string;
  habits: Habit[];
  completedCount: number;
  totalCount: number;
}

/** Props for the collapsible section header. */
export interface TimeGroupSectionHeaderProps {
  group: HabitTimeGroup;
  isExpanded: boolean;
  onToggle: () => void;
}
