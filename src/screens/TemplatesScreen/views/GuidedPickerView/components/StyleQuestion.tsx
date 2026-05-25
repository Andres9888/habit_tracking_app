import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import type { StylePreference } from '../../../utils/recommendation';

interface StyleQuestionProps {
  value: StylePreference | undefined;
  onChange: (value: StylePreference) => void;
}

const OPTIONS: { value: StylePreference; label: string; detail: string }[] = [
  { detail: 'Easy to build, low friction', label: 'Gentle', value: 'gentle' },
  { detail: 'Harder but more rewarding', label: 'Challenging', value: 'challenging' },
];

export function StyleQuestion({ value, onChange }: StyleQuestionProps) {
  const { colors } = useThemeColors();
  return (
    <View style={s.section}>
      <Text style={[s.q, { color: colors.text.primary }]}>What's your preferred style?</Text>
      {OPTIONS.map((o) => {
        const isSelected = value === o.value;
        return (
          <Pressable
            key={o.value}
            style={[s.option, { backgroundColor: isSelected ? colors.primary[50] : colors.card, borderColor: isSelected ? colors.primary[500] : colors.border }]}
            onPress={() => onChange(o.value)}
          >
            <Text style={[s.optLabel, { color: colors.text.primary }]}>{o.label}</Text>
            <Text style={[s.optDetail, { color: colors.text.secondary }]}>{o.detail}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  option: { borderRadius: 12, borderWidth: 1.5, marginBottom: 8, padding: 14 },
  optDetail: { fontSize: 12 },
  optLabel: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  q: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  section: { marginBottom: 16 },
});
