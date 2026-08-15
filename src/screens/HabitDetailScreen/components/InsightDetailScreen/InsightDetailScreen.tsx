import { Text } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { useHabitInsights } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import type { InsightId } from '../../useDetailFlow';
import { FlowPage } from '../FlowPage';
import { OneFixCard } from '../NoticingSection/OneFixCard';
import { WhatsWorkingCard } from '../NoticingSection/WhatsWorkingCard';

interface InsightDetailScreenProps {
  habit: Habit;
  insightId?: InsightId;
  onEdit: () => void;
}

export function InsightDetailScreen({
  habit,
  insightId,
  onEdit,
}: InsightDetailScreenProps) {
  const palette = useInsightPalette();
  const insights = useHabitInsights({
    daysOfWeek: habit.daysOfWeek,
    habitCreatedAt: habit.createdAt,
    habitId: habit._id,
    reminderTime: habit.reminderTime,
  });
  const working = insightId === 'working' ? insights.working : null;
  const oneFix = insightId === 'oneFix' ? insights.oneFix : null;

  return (
    <FlowPage footnote='Every number here comes from check-ins you recorded. Nothing is predicted.'>
      {working ? (
        <WhatsWorkingCard
          insight={working}
          palette={palette}
          onAdjustReminder={onEdit}
        />
      ) : null}
      {oneFix ? (
        <OneFixCard
          cue={habit.cueAfterBehavior}
          habitId={habit._id}
          insight={oneFix}
          palette={palette}
        />
      ) : null}
      {working || oneFix ? null : (
        <Text
          style={{
            color: palette.textSecondary,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          This pattern needs more check-ins before it can be shown.
        </Text>
      )}
    </FlowPage>
  );
}
