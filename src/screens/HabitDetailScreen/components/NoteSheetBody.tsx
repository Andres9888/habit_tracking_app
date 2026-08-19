import { Text, TextInput, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';
import { NoteSheetActions } from './NoteSheetActions';

interface NoteSheetBodyProps {
  draft: string;
  existing: string;
  hint: string;
  saving?: boolean;
  onCancel: () => void;
  onChange: (text: string) => void;
  onSave: () => void;
}

export function NoteSheetBody({
  draft,
  existing,
  hint,
  saving = false,
  onCancel,
  onChange,
  onSave,
}: NoteSheetBodyProps) {
  const palette = useInsightPalette();

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingBottom: 34,
        paddingHorizontal: 20,
        paddingTop: 12,
      }}
    >
      <View
        style={{
          alignSelf: 'center',
          backgroundColor: palette.cardBorder,
          borderRadius: 3,
          height: 5,
          marginBottom: 14,
          width: 38,
        }}
      />
      <Text
        style={{
          color: palette.textPrimary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 19,
          fontWeight: fontWeights.medium,
        }}
      >
        {existing ? 'Edit note' : 'Add a note'}
      </Text>
      <Text
        style={{
          color: palette.textTertiary,
          fontSize: 13,
          marginBottom: 14,
          marginTop: 4,
        }}
      >
        {hint}
      </Text>
      <TextInput
        multiline
        accessibilityLabel='Day note'
        placeholder='What was today like?'
        placeholderTextColor={palette.textTertiary}
        style={{
          backgroundColor: palette.cellFuture,
          borderColor: palette.cardBorder,
          borderRadius: 14,
          borderWidth: 1,
          color: palette.textPrimary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 15,
          lineHeight: 22,
          minHeight: 96,
          padding: 12,
          textAlignVertical: 'top',
        }}
        value={draft}
        onChangeText={onChange}
      />
      <NoteSheetActions saving={saving} onCancel={onCancel} onSave={onSave} />
    </View>
  );
}
