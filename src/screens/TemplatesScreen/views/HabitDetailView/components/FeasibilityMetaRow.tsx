import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface FeasibilityMetaRowProps {
  estimatedMinutes: number | undefined;
  growthType: string | undefined;
}

export function FeasibilityMetaRow({ estimatedMinutes, growthType }: FeasibilityMetaRowProps) {
  const { colors } = useThemeColors();
  const time = estimatedMinutes ? `${estimatedMinutes} min` : 'Quick';
  const growth = growthType ?? 'Gentle start';
  return (
    <View style={s.row}>
      <View style={[s.badge, { backgroundColor: colors.card }]}>
        <Text style={[s.label, { color: colors.text.primary }]}>⏱ {time}</Text>
      </View>
      <View style={[s.badge, { backgroundColor: colors.card }]}>
        <Text style={[s.label, { color: colors.text.primary }]}>📈 {growth}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { borderRadius: 12, marginRight: 8, paddingHorizontal: 12, paddingVertical: 6 },
  label: { fontSize: 13, fontWeight: '500' },
  row: { flexDirection: 'row', marginBottom: 16, paddingHorizontal: 16 },
});
