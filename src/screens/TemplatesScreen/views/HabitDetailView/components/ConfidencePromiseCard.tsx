import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface ConfidencePromiseCardProps {
  icon: string;
  name: string;
  promise: string;
}

export function ConfidencePromiseCard({ icon, name, promise }: ConfidencePromiseCardProps) {
  const { colors } = useThemeColors();
  return (
    <View style={[s.card, { backgroundColor: colors.card }]}>
      <Text style={s.icon}>{icon}</Text>
      <Text style={[s.name, { color: colors.text.primary }]}>{name}</Text>
      <Text style={[s.promise, { color: colors.text.secondary }]}>{promise}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { alignItems: 'center', borderRadius: 16, marginBottom: 16, padding: 24 },
  icon: { fontSize: 48, marginBottom: 8 },
  name: { fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  promise: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
});
