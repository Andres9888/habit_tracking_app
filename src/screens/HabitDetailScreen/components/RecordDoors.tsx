import { BarChart3, CalendarDays } from 'lucide-react-native';
import { View } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { MIN_DAYS_OF_DATA } from '../insights';
import { useInsightPalette, type InsightPalette } from '../insightPalette';
import { FlowDivider, FlowRow, FlowRowGroup } from './FlowRow';
import { FlowSectionLabel } from './FlowSectionLabel';

interface RecordDoorsProps {
  /** Check-in days behind Analytics. Below `MIN_DAYS_OF_DATA` the page is empty. */
  daysOfData: number;
  onOpenAnalytics: () => void;
  onOpenHistory: () => void;
}

const UNLOCKED_SUBTITLE = 'See what helps you stay consistent';

export function analyticsSubtitle(daysOfData: number): string {
  if (daysOfData >= MIN_DAYS_OF_DATA) return UNLOCKED_SUBTITLE;
  const remaining = MIN_DAYS_OF_DATA - Math.max(0, daysOfData);
  return `Unlocks after ${MIN_DAYS_OF_DATA} days · ${remaining} to go`;
}

/** Decorative: the countdown is already spelled out in the subtitle. */
function UnlockRail({
  daysOfData,
  palette,
}: {
  daysOfData: number;
  palette: InsightPalette;
}) {
  const pct = Math.min(
    100,
    Math.max(0, (daysOfData / MIN_DAYS_OF_DATA) * 100)
  );
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={{
        backgroundColor: palette.cellEmpty,
        borderRadius: borderRadius.full,
        height: 2,
        marginTop: 7,
        maxWidth: 150,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          backgroundColor: palette.green,
          height: '100%',
          width: `${pct}%`,
        }}
      />
    </View>
  );
}

/**
 * Both doors are always present. An earlier revision hid Analytics during
 * recovery, following the prototype — but recovery is the ordinary state for
 * anyone who did not log the last scheduled day, and these rows are the only
 * route to Analytics anywhere in the app, so the page simply vanished. The
 * "don't grade me after a miss" intent is served by the recovery caption on the
 * strength dial; a door is not a grade.
 *
 * Titles name what you do there, not the screen: "History" and "Analytics"
 * describe code; "Calendar & notes" and "Patterns & trends" predict the
 * destination. Routes and screen names are unchanged.
 *
 * Analytics stays openable while locked — but its subtitle stops promising
 * "what helps you stay consistent" before there is any data to say it with,
 * and counts down to the unlock instead.
 */
export function RecordDoors({
  daysOfData,
  onOpenAnalytics,
  onOpenHistory,
}: RecordDoorsProps) {
  const palette = useInsightPalette();
  const locked = daysOfData < MIN_DAYS_OF_DATA;

  return (
    <View>
      <FlowSectionLabel>The record</FlowSectionLabel>
      <FlowRowGroup>
        <FlowRow
          icon={
            <CalendarDays color={palette.green} size={20} strokeWidth={1.8} />
          }
          subtitle='View or correct past days'
          title='Calendar & notes'
          onPress={onOpenHistory}
        />
        <FlowDivider />
        <FlowRow
          footer={
            locked ? (
              <UnlockRail daysOfData={daysOfData} palette={palette} />
            ) : null
          }
          icon={<BarChart3 color={palette.green} size={20} strokeWidth={1.8} />}
          subtitle={analyticsSubtitle(daysOfData)}
          title='Patterns & trends'
          onPress={onOpenAnalytics}
        />
      </FlowRowGroup>
    </View>
  );
}
