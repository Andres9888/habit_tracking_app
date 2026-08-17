import { Pressable, Text, View } from 'react-native';
import { Pencil, Undo2 } from 'lucide-react-native';
import { useInsightPalette } from '../../insightPalette';

interface HeroActionPairProps {
  disabled: boolean;
  noteLabel: string;
  onAddNote: () => void;
  onUndo: () => void;
}

export function HeroActionPair({
  disabled,
  noteLabel,
  onAddNote,
  onUndo,
}: HeroActionPairProps) {
  const palette = useInsightPalette();

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: 15,
        borderWidth: 1,
        flexDirection: 'row',
        height: 48,
        overflow: 'hidden',
      }}
    >
      <Pressable
        accessibilityLabel='Undo today’s check-in'
        accessibilityRole='button'
        disabled={disabled}
        style={{
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          gap: 7,
          justifyContent: 'center',
        }}
        onPress={onUndo}
      >
        <Undo2 color={palette.textTertiary} size={17} strokeWidth={2} />
        <Text style={{ color: palette.textSecondary, fontSize: 15 }}>Undo</Text>
      </Pressable>
      <View
        style={{
          alignSelf: 'center',
          backgroundColor: palette.divider,
          height: 24,
          width: 1,
        }}
      />
      <Pressable
        accessibilityLabel={noteLabel}
        accessibilityRole='button'
        style={{
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          gap: 7,
          justifyContent: 'center',
        }}
        onPress={onAddNote}
      >
        <Pencil color={palette.textTertiary} size={17} strokeWidth={2} />
        <Text style={{ color: palette.textSecondary, fontSize: 15 }}>
          {noteLabel}
        </Text>
      </Pressable>
    </View>
  );
}
