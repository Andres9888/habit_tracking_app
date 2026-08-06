/**
 * NoticingSection — "What we're noticing": the conditional insight cards.
 *
 * The cards themselves are PHASE 2 in the design's MVP scope — they need ≥14
 * days AND a real detected pattern. What ships before then is the dashed
 * placeholder the same note calls for, so the section always holds its place in
 * the stack. An earlier revision returned null once the habit had enough history
 * but no detectable pattern, which made the section vanish and read as missing.
 */
import { View } from 'react-native';
import { spacing } from '../../../../theme/spacing';
import type { HabitInsights } from '../../insights';
import { MIN_DAYS_OF_DATA } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { NoticingPlaceholder } from './NoticingPlaceholder';
import { OneFixCard } from './OneFixCard';
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

  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeading palette={palette} title="What we're noticing" />
      {hasCards ? null : (
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
