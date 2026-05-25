import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface FirstImportBranchCardProps {
  templateName: string;
  onGuide: () => void;
  onViewPlan: () => void;
  onDismiss: () => void;
}

export function FirstImportBranchCard({ templateName, onGuide, onViewPlan, onDismiss }: FirstImportBranchCardProps) {
  const { colors } = useThemeColors();
  return (
    <View style={s.container}>
      <Text style={[s.header, { color: colors.text.primary }]}>Habit added 🎉</Text>
      <Text style={[s.subtitle, { color: colors.text.secondary }]}>
        {templateName} is now in your daily plan.
      </Text>
      <Pressable style={[s.primaryBtn, { backgroundColor: colors.primary[600] }]} onPress={onGuide}>
        <Text style={s.primaryLabel}>Take 30-second guide</Text>
      </Pressable>
      <Pressable style={[s.secondaryBtn, { borderColor: colors.border }]} onPress={onViewPlan}>
        <Text style={[s.secondaryLabel, { color: colors.text.primary }]}>View today's plan</Text>
      </Pressable>
      <Pressable style={s.tertiaryBtn} onPress={onDismiss}>
        <Text style={[s.tertiaryLabel, { color: colors.text.secondary }]}>I'm good for now</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { alignItems: 'center', padding: 24 },
  header: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  primaryBtn: { borderRadius: 14, marginBottom: 10, paddingHorizontal: 28, paddingVertical: 14, width: '100%' },
  primaryLabel: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  secondaryBtn: { borderRadius: 14, borderWidth: 1.5, marginBottom: 10, paddingHorizontal: 28, paddingVertical: 14, width: '100%' },
  secondaryLabel: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  subtitle: { fontSize: 15, marginBottom: 24, textAlign: 'center' },
  tertiaryBtn: { paddingVertical: 10 },
  tertiaryLabel: { fontSize: 14 },
});
