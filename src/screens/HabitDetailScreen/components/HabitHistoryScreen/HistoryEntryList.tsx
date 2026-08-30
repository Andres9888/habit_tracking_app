import { Text } from 'react-native';
import { useInsightPalette } from '../../insightPalette';
import { FlowDivider, FlowRow, FlowRowGroup } from '../FlowRow';
import { EntryMark } from './EntryMark';
import type { HistoryEntry } from './historyEntries';
import { habitDayStateLabel } from '../../../../features/habits/habitDayState';

interface HistoryEntryListProps {
  entries: HistoryEntry[];
  onOpenDay: (date: string) => void;
}

export function HistoryEntryList({
  entries,
  onOpenDay,
}: HistoryEntryListProps) {
  const palette = useInsightPalette();

  if (entries.length === 0) {
    return (
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 14,
          paddingHorizontal: 4,
        }}
      >
        No days in this month yet.
      </Text>
    );
  }

  return (
    <FlowRowGroup>
      {entries.map((entry, index) => (
        <FragmentRow
          key={entry.date}
          entry={entry}
          showDivider={index > 0}
          onOpenDay={onOpenDay}
        />
      ))}
    </FlowRowGroup>
  );
}

function FragmentRow({
  entry,
  onOpenDay,
  showDivider,
}: {
  entry: HistoryEntry;
  onOpenDay: (date: string) => void;
  showDivider: boolean;
}) {
  return (
    <>
      {showDivider ? <FlowDivider /> : null}
      <FlowRow
        accessibilityHint='Opens this day so you can correct it'
        leading={<EntryMark state={entry.state} />}
        subtitle={
          entry.note ? `“${entry.note}”` : habitDayStateLabel(entry.state, true)
        }
        subtitleItalic={Boolean(entry.note)}
        title={entry.label}
        onPress={() => onOpenDay(entry.date)}
      />
    </>
  );
}
