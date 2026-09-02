import type { Habit } from '../../../features/habits/types';
import { getLocalDateString } from '../../../utils/getLocalDateString';
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
  notes: Record<string, string>;
  params: FlowParams;
  pendingToggleDate?: string | null;
  route: DetailRoute;
  todayNote?: string;
  visible: boolean;
  onDayPress: (date: string, isCompleted: boolean) => void;
  onEdit: () => void;
  onOpenAnalytics: () => void;
  onOpenDay: (date: string) => void;
  onOpenHistory: (date?: string) => void;
  onOpenInsight: (id: InsightId) => void;
  onOpenNote: (date: string) => void;
  onPinnedChange: (pinned: boolean) => void;
  onRecoveryChange?: (isRecovery: boolean) => void;
}

export function DetailFlowSwitch(props: DetailFlowSwitchProps) {
  const { habit, notes, params, route, onOpenDay, onOpenNote } = props;
  const { pendingToggleDate } = props;
  if (route === 'history') {
    return (
      <HabitHistoryScreen
        focusDate={params.focusDate}
        habit={habit}
        notes={notes}
        pendingToggleDate={pendingToggleDate}
        onOpenDay={onOpenDay}
      />
    );
  }
  if (route === 'analytics') {
    return (
      <HabitAnalyticsScreen
        habit={habit}
        onOpenHistory={props.onOpenHistory}
        onOpenInsight={props.onOpenInsight}
      />
    );
  }
  if (route === 'day') {
    const date = params.focusDate ?? getLocalDateString();
    return (
      <DayDetailScreen
        focusDate={params.focusDate}
        habit={habit}
        note={notes[date] ?? ''}
        pendingToggleDate={pendingToggleDate}
        onOpenDay={onOpenDay}
        onOpenNote={() => onOpenNote(date)}
        onToggleDay={props.onDayPress}
      />
    );
  }
  if (route === 'insight') {
    return (
      <InsightDetailScreen
        habit={habit}
        insightId={params.insightId}
        onEdit={props.onEdit}
      />
    );
  }
  return (
    <HabitDetailContent
      completedDates={props.completedDates}
      habit={habit}
      isCompletedToday={props.isCompletedToday}
      pendingToggleDate={pendingToggleDate}
      todayNote={props.todayNote}
      visible={props.visible}
      onDayPress={props.onDayPress}
      onEdit={props.onEdit}
      onOpenAnalytics={props.onOpenAnalytics}
      onOpenDay={onOpenDay}
      onOpenHistory={() => props.onOpenHistory()}
      onOpenInsight={props.onOpenInsight}
      onOpenNote={() => onOpenNote(getLocalDateString())}
      onPinnedChange={props.onPinnedChange}
      onRecoveryChange={props.onRecoveryChange}
    />
  );
}
