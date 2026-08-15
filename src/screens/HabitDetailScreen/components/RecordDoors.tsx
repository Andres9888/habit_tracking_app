import { View } from 'react-native';
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
  return (
    <View>
      <FlowSectionLabel>The record</FlowSectionLabel>
      <FlowRowGroup>
        <FlowRow
          subtitle='Dates, notes, and edits'
          title='History'
          onPress={onOpenHistory}
        />
        <FlowDivider />
        <FlowRow
          subtitle='Patterns from real check-ins'
          title='Analytics'
          onPress={onOpenAnalytics}
        />
      </FlowRowGroup>
    </View>
  );
}
