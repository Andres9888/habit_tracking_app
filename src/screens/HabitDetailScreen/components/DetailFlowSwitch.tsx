import type { Habit } from '../../../features/habits/types';
import type { DetailRoute, FlowParams, InsightId } from '../useDetailFlow';
import { DayDetailScreen } from './DayDetailScreen';
import { HabitAnalyticsScreen } from './HabitAnalyticsScreen';
import { HabitDetailContent } from './HabitDetailContent';
import { HabitHistoryScreen } from './HabitHistoryScreen';
import { InsightDetailScreen } from './InsightDetailScreen';

export interface DetailFlowSwitchProps {
  completedDates: Set<string>;
  habit: Habit;
  isCompletedToday: boolean;
  params: FlowParams;
  pendingToggleDate?: string | null;
  route: DetailRoute;
  visible: boolean;
  onDayPress: (date: string, isCompleted: boolean) => void;
  onEdit: () => void;
  onOpenAnalytics: () => void;
  onOpenDay: (date: string) => void;
  onOpenHistory: (date?: string) => void;
  onOpenInsight: (id: InsightId) => void;
  onPinnedChange: (pinned: boolean) => void;
}

export function DetailFlowSwitch({
  completedDates,
  habit,
  isCompletedToday,
  params,
  pendingToggleDate = null,
  route,
  visible,
  onDayPress,
  onEdit,
  onOpenAnalytics,
  onOpenDay,
  onOpenHistory,
  onOpenInsight,
  onPinnedChange,
}: DetailFlowSwitchProps) {
  if (route === 'history') {
    return (
      <HabitHistoryScreen
        focusDate={params.focusDate}
        habit={habit}
        pendingToggleDate={pendingToggleDate}
        onOpenDay={onOpenDay}
      />
    );
  }
  if (route === 'analytics') {
    return (
      <HabitAnalyticsScreen
        habit={habit}
        onOpenHistory={onOpenHistory}
        onOpenInsight={onOpenInsight}
      />
    );
  }
  if (route === 'day') {
    return (
      <DayDetailScreen
        focusDate={params.focusDate}
        habit={habit}
        pendingToggleDate={pendingToggleDate}
        onOpenDay={onOpenDay}
        onToggleDay={onDayPress}
      />
    );
  }
  if (route === 'insight') {
    return (
      <InsightDetailScreen
        habit={habit}
        insightId={params.insightId}
        onEdit={onEdit}
      />
    );
  }

  return (
    <HabitDetailContent
      completedDates={completedDates}
      habit={habit}
      isCompletedToday={isCompletedToday}
      pendingToggleDate={pendingToggleDate}
      visible={visible}
      onDayPress={onDayPress}
      onOpenAnalytics={onOpenAnalytics}
      onOpenDay={onOpenDay}
      onOpenHistory={() => onOpenHistory()}
      onOpenInsight={onOpenInsight}
      onPinnedChange={onPinnedChange}
    />
  );
}
