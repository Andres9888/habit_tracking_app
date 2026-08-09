/** HabitNoteCard field body — header + editable text. */
import { Text, View } from 'react-native';
import { ThemedTextInput } from '../../../components/ui/TextInput';
import { fontWeights } from '../../../theme/typography';
import type { InsightPalette } from '../insightPalette';
import { noteCardFrame } from './noteCardFrame';

interface HabitNoteFieldProps {
  canEdit: boolean;
  draft: string;
  isToday: boolean;
  label: string;
  palette: InsightPalette;
  variant: 'dashed' | 'onBand';
  onBlur: () => void;
  onChangeText: (text: string) => void;
}

export function HabitNoteField({
  canEdit,
  draft,
  isToday,
  label,
  onBlur,
  onChangeText,
  palette,
  variant,
}: HabitNoteFieldProps) {
  return (
    <View
      style={{
        paddingHorizontal: variant === 'onBand' ? 16 : 18,
        paddingVertical: 14,
        ...noteCardFrame(variant, palette),
      }}
    >
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
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
          {isToday ? "Today's note" : 'Day note'}
        </Text>
        <Text style={{ color: palette.textTertiary, fontSize: 11 }}>
          {canEdit ? 'optional' : 'complete day to write'}
        </Text>
      </View>
      <ThemedTextInput
        multiline
        accessibilityLabel={label}
        editable={canEdit}
        placeholder={
          canEdit ? 'How did it go today?' : 'Complete this day to add a note'
        }
        style={{
          color: palette.textPrimary,
          fontSize: 14,
          lineHeight: 20,
          marginTop: 8,
          minHeight: 24,
          opacity: canEdit ? 1 : 0.55,
          padding: 0,
        }}
        value={draft}
        onBlur={onBlur}
        onChangeText={onChangeText}
      />
    </View>
  );
}
