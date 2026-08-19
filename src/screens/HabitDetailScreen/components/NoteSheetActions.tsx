import { Pressable, Text, View } from 'react-native';
import { fontWeights } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';

interface NoteSheetActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
}

export function NoteSheetActions({
  onCancel,
  onSave,
  saving = false,
}: NoteSheetActionsProps) {
  const palette = useInsightPalette();

  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
      <Pressable
        accessibilityRole='button'
        disabled={saving}
        style={{
          alignItems: 'center',
          borderColor: palette.cardBorder,
          borderRadius: 15,
          borderWidth: 1,
          flex: 1,
          height: 50,
          justifyContent: 'center',
          opacity: saving ? 0.5 : 1,
        }}
        onPress={onCancel}
      >
        <Text style={{ color: palette.textSecondary, fontSize: 15 }}>
          Cancel
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ busy: saving }}
        disabled={saving}
        style={{
          alignItems: 'center',
          backgroundColor: palette.green,
          borderRadius: 15,
          flex: 1,
          height: 50,
          justifyContent: 'center',
          opacity: saving ? 0.5 : 1,
        }}
        onPress={onSave}
      >
        <Text
          style={{
            color: palette.onGreen,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
          }}
        >
          {saving ? 'Saving…' : 'Save note'}
        </Text>
      </Pressable>
    </View>
  );
}
