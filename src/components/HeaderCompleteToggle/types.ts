/**
 * Types for HeaderCompleteToggle component
 */

import type { Id } from '../../../convex/_generated/dataModel';

export interface HeaderCompleteToggleProps {
  completedToday: boolean;
  habitId: Id<'habits'>;
  habitName: string;
  onComplete?: () => void;
  onUncomplete?: () => void;
}
