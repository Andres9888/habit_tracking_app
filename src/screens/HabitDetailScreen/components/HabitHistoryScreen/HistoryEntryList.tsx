import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useInsightPalette } from '../../insightPalette';
import { FlowDivider, FlowRow, FlowRowGroup } from '../FlowRow';
import type { HistoryEntry } from './historyEntries';

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

function EntryMark({ done }: { done: boolean }) {
  const palette = useInsightPalette();
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: done ? palette.green : undefined,
        borderColor: done ? palette.green : palette.missedRing,
        borderRadius: 15,
        borderStyle: done ? 'solid' : 'dashed',
        borderWidth: 1.5,
        height: 30,
        justifyContent: 'center',
        width: 30,
      }}
    >
      {done ? (
        <Check color={palette.onGreen} size={16} strokeWidth={2.4} />
      ) : null}
    </View>
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
        leading={<EntryMark done={entry.done} />}
        subtitle={
          entry.note ? `“${entry.note}”` : entry.done ? 'Completed' : 'No entry'
        }
        subtitleItalic={Boolean(entry.note)}
        title={entry.label}
        onPress={() => onOpenDay(entry.date)}
      />
    </>
  );
}
