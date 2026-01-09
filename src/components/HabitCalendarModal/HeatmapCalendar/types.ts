import type { Id } from '../../../../convex/_generated/dataModel';

export interface HeatmapCalendarProps {
  habitId: Id<'habits'>;
  tracking: Array<{ habitId: Id<'habits'>; date: string; completed: boolean }>;
  monthsToShow?: number;
}
