/**
 * NoticingSection — "What we're noticing": the conditional insight cards.
 *
 * Per the design's implementation notes these render only with enough history
 * AND a detected pattern. With neither, the whole section (heading included)
 * disappears rather than showing generic filler; with only a little history it
 * shows a single quiet line explaining when patterns start to appear.
 */
import { Text, View } from 'react-native';
import { spacing } from '../../../../theme/spacing';
import type { HabitInsights } from '../../insights';
import { MIN_DAYS_OF_DATA } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
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
  const isTooEarly = insights.daysOfData < MIN_DAYS_OF_DATA;

  if (!hasCards && !isTooEarly) return null;

  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeading palette={palette} title="What we're noticing" />
      {isTooEarly && !hasCards ? (
        <Text
          style={{
            color: palette.textTertiary,
            fontSize: 13,
            lineHeight: 20,
          }}
        >
          Patterns start to appear around day {MIN_DAYS_OF_DATA} — you&rsquo;re
          on day {Math.max(1, insights.daysOfData)}.
        </Text>
      ) : null}
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
