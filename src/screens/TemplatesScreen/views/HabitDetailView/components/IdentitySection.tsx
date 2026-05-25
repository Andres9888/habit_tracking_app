import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface IdentitySectionProps {
  identity: string;
}

export function IdentitySection({ identity }: IdentitySectionProps) {
  const { colors } = useThemeColors();
  return (
    <View style={[s.section, { borderColor: colors.primary[300] }]}>
      <Text style={[s.quote, { color: colors.text.primary }]}>"{identity}"</Text>
    </View>
  );
}

const s = StyleSheet.create({
  quote: { fontSize: 16, fontStyle: 'italic', lineHeight: 24 },
  section: { borderLeftWidth: 3, marginBottom: 16, marginHorizontal: 16, paddingLeft: 12, paddingVertical: 8 },
});
