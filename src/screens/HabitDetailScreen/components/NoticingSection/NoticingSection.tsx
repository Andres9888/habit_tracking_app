/**
 * NoticingSection — "What we're noticing": provisional science tip early on,
 * then pattern cards once ≥14 days of data exist.
 */
import { useQuery } from 'convex/react';
import { View } from 'react-native';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { spacing } from '../../../../theme/spacing';
import type { HabitInsights } from '../../insights';
import { MIN_DAYS_OF_DATA } from '../../insights';
import { buildProvisionalInsight } from '../../insights/buildProvisionalInsight';
import { useInsightPalette } from '../../insightPalette';
import { NoticingPlaceholder } from './NoticingPlaceholder';
import { OneFixCard } from './OneFixCard';
import { ProvisionalInsightCard } from './ProvisionalInsightCard';
import { SectionHeading } from './SectionHeading';
import { WhatsWorkingCard } from './WhatsWorkingCard';

interface NoticingSectionProps {
  cue?: string;
  habitId: string;
  insights: HabitInsights;
  onAdjustReminder: () => void;
}

export function NoticingSection({
  cue,
  habitId,
  insights,
  onAdjustReminder,
}: NoticingSectionProps) {
  const palette = useInsightPalette();
  const hasCards = insights.working !== null || insights.oneFix !== null;
  const science = useQuery(
    api.habits.getHabitScience,
    insights.daysOfData < MIN_DAYS_OF_DATA && !hasCards
      ? { habitId: habitId as Id<'habits'> }
      : 'skip'
  );
  const provisional = buildProvisionalInsight(science, insights.daysOfData);

  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeading palette={palette} title="What we're noticing" />
      {hasCards ? null : provisional ? (
        <ProvisionalInsightCard insight={provisional} palette={palette} />
      ) : (
        <NoticingPlaceholder
          daysOfData={insights.daysOfData}
          minDays={MIN_DAYS_OF_DATA}
          palette={palette}
        />
      )}
      {insights.working ? (
        <WhatsWorkingCard
          insight={insights.working}
          palette={palette}
          onAdjustReminder={onAdjustReminder}
        />
      ) : null}
      {insights.oneFix ? (
        <OneFixCard
          cue={cue}
          habitId={habitId}
          insight={insights.oneFix}
          palette={palette}
        />
      ) : null}
    </View>
  );
}
