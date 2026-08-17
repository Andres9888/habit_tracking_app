import { Text, View } from 'react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';

interface DayNoteCardProps {
  note: string;
}

export function DayNoteCard({ note }: DayNoteCardProps) {
  const palette = useInsightPalette();

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 15,
        ...shadows.subtle,
      }}
    >
      <Text
        style={{
          color: palette.textTertiary,
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        Note
      </Text>
      <Text
        style={{
          color: note ? palette.textSecondary : palette.textTertiary,
          fontFamily: note ? fontFamilies.primary.display : undefined,
          fontSize: note ? 16 : 14,
          fontStyle: note ? 'italic' : undefined,
          lineHeight: 23,
          marginTop: 8,
        }}
      >
        {note || 'No note for this day.'}
      </Text>
    </View>
  );
}
