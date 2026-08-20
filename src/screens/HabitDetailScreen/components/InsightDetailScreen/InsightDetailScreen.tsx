import type { Habit } from '../../../../features/habits/types';
import { useHabitInsights } from '../../insights';
import type { InsightId } from '../../useDetailFlow';
import { FlowPage } from '../FlowPage';
import { InsightEmptyCard } from './InsightEmptyCard';
import { INSIGHT_FOOTNOTE } from './insightEvidence';
import { OneFixEvidence } from './OneFixEvidence';
import { WorkingEvidence } from './WorkingEvidence';

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
  const insights = useHabitInsights({
    daysOfWeek: habit.daysOfWeek,
    habitCreatedAt: habit.createdAt,
    habitId: habit._id,
    reminderTime: habit.reminderTime,
  });
  const working = insightId === 'working' ? insights.working : null;
  const oneFix = insightId === 'oneFix' ? insights.oneFix : null;

  return (
    <FlowPage footnote={INSIGHT_FOOTNOTE}>
      {working ? <WorkingEvidence insight={working} onEdit={onEdit} /> : null}
      {oneFix ? (
        <OneFixEvidence cue={habit.cueAfterBehavior} insight={oneFix} />
      ) : null}
      {working || oneFix ? null : <InsightEmptyCard />}
    </FlowPage>
  );
}
