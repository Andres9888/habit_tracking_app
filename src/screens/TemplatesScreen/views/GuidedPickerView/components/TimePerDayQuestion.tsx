import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import type { TimeBucket } from '../../../utils/recommendation';

interface TimePerDayQuestionProps {
  value: TimeBucket | undefined;
  onChange: (value: TimeBucket) => void;
}

const OPTIONS: { value: TimeBucket; label: string; detail: string }[] = [
  { detail: '0-5 min', label: 'Micro', value: 'micro' },
  { detail: '6-15 min', label: 'Steady', value: 'steady' },
  { detail: '16+ min', label: 'Deep', value: 'deep' },
];

export function TimePerDayQuestion({ value, onChange }: TimePerDayQuestionProps) {
  const { colors } = useThemeColors();
  return (
    <View style={s.section}>
      <Text style={[s.q, { color: colors.text.primary }]}>How much time per day?</Text>
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
