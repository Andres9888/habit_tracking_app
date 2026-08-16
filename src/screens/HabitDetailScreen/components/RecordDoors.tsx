import { BarChart3, CalendarDays } from 'lucide-react-native';
import { View } from 'react-native';
import { useInsightPalette } from '../insightPalette';
import { FlowDivider, FlowRow, FlowRowGroup } from './FlowRow';
import { FlowSectionLabel } from './FlowSectionLabel';

interface RecordDoorsProps {
  onOpenAnalytics: () => void;
  onOpenHistory: () => void;
}

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
          icon={<CalendarDays color={palette.green} size={20} strokeWidth={1.8} />}
          subtitle='Dates, notes, and edits'
          title='History'
          onPress={onOpenHistory}
        />
        <FlowDivider />
        <FlowRow
          icon={<BarChart3 color={palette.green} size={20} strokeWidth={1.8} />}
          subtitle='Patterns from real check-ins'
          title='Analytics'
          onPress={onOpenAnalytics}
        />
      </FlowRowGroup>
    </View>
  );
}
