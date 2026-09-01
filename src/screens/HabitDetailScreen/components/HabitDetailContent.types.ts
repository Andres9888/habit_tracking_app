/** Props for HabitDetailContent — the Detail route's scrolling body. */
import type { Habit } from '../../../features/habits/types';
import type { InsightId } from '../useDetailFlow';

export interface HabitDetailContentProps {
  completedDates: Set<string>;
  habit: Habit;
  isCompletedToday: boolean;
  pendingToggleDate?: string | null;
  visible?: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onOpenAnalytics?: () => void;
  onOpenDay?: (date: string) => void;
  onOpenHistory?: () => void;
  onOpenInsight?: (id: InsightId) => void;
  onOpenNote?: () => void;
  onPinnedChange?: (pinned: boolean) => void;
  /** Lets the fixed header tint follow the hero wash into recovery. */
  onRecoveryChange?: (isRecovery: boolean) => void;
  todayNote?: string;
}
