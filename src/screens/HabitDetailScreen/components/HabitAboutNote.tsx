/** Pinned legacy habit-level notes — kept reachable after per-day notes. */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import type { InsightPalette } from '../insightPalette';

interface HabitAboutNoteProps {
  note: string;
  palette: InsightPalette;
}

export function HabitAboutNote({ note, palette }: HabitAboutNoteProps) {
  return (
    <View
      accessibilityLabel={`About this habit: ${note}`}
      style={{
        backgroundColor: palette.cellEmpty,
        borderRadius: borderRadius.medium,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}
    >
      <Text
        style={{
          color: palette.textTertiary,
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        About this habit
      </Text>
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 13,
          lineHeight: 18,
          marginTop: 6,
        }}
      >
        {note}
      </Text>
    </View>
  );
}
