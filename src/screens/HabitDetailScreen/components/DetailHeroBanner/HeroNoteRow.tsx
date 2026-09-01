/**
 * HeroNoteRow — the whole secondary slot once today is logged.
 *
 * Undo used to share this row; it now lives on the check-in toggle itself, so
 * the only thing left to offer here is the note.
 */
import { Pressable, Text, View } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { useInsightPalette } from '../../insightPalette';

interface HeroNoteRowProps {
  label: string;
  onPress: () => void;
}

export function HeroNoteRow({ label, onPress }: HeroNoteRowProps) {
  const palette = useInsightPalette();

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: 15,
        borderWidth: 1,
        height: 48,
        overflow: 'hidden',
      }}
    >
      <Pressable
        accessibilityLabel={label}
        accessibilityRole='button'
        style={{
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          gap: 7,
          justifyContent: 'center',
        }}
        onPress={onPress}
      >
        <Pencil color={palette.textTertiary} size={17} strokeWidth={2} />
        <Text style={{ color: palette.textSecondary, fontSize: 15 }}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}
