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
 *
 * Titles name what you do there, not the screen: "History" and "Analytics"
 * describe code; "Calendar & notes" and "Patterns & trends" predict the
 * destination. Routes and screen names are unchanged.
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
          subtitle='View or correct past days'
          title='Calendar & notes'
          onPress={onOpenHistory}
        />
        <FlowDivider />
        <FlowRow
          icon={<BarChart3 color={palette.green} size={20} strokeWidth={1.8} />}
          subtitle='See what helps you stay consistent'
          title='Patterns & trends'
          onPress={onOpenAnalytics}
        />
      </FlowRowGroup>
    </View>
  );
}
