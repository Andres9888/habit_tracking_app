/**
 * QuickCompleteButton Type Definitions
 */

import type { Id } from '../../../convex/_generated/dataModel';

export interface QuickCompleteButtonProps {
  completedToday: boolean;
  habitId: Id<'habits'>;
  habitName: string;
  onComplete?: () => void;
  onUncomplete?: () => void;
}

export interface ConfettiBurstProps {
  isActive: boolean;
}
