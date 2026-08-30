import { BarChart3, CalendarDays } from 'lucide-react-native';
import { View } from 'react-native';
import { useInsightPalette } from '../insightPalette';
import { FlowDivider, FlowRow, FlowRowGroup } from './FlowRow';
import { FlowSectionLabel } from './FlowSectionLabel';

interface RecordDoorsProps {
  onOpenAnalytics: () => void;
  onOpenHistory: () => void;
}

/**
 * Both doors are always present. An earlier revision hid Analytics during
 * recovery, following the prototype — but recovery is the ordinary state for
 * anyone who did not log the last scheduled day, and these rows are the only
 * route to Analytics anywhere in the app, so the page simply vanished. The
 * "don't grade me after a miss" intent is served by hiding the strength dial;
 * a door is not a grade.
 */
export function RecordDoors({
  onOpenAnalytics,
  onOpenHistory,
}: RecordDoorsProps) {
  const palette = useInsightPalette();

  return (
    <View>
      <FlowSectionLabel>The record</FlowSectionLabel>
      <FlowRowGroup>
        <FlowRow
          icon={
            <CalendarDays color={palette.green} size={20} strokeWidth={1.8} />
          }
          subtitle='Runs, calendar and the year grid'
          title='Full history'
          onPress={onOpenHistory}
        />
        <FlowDivider />
        <FlowRow
          icon={<BarChart3 color={palette.green} size={20} strokeWidth={1.8} />}
          subtitle='Trend, patterns and what’s working'
          title='Analytics'
          onPress={onOpenAnalytics}
        />
      </FlowRowGroup>
    </View>
  );
}
