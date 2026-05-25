import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface WhyThisWorksSectionProps {
  benefits: string[];
  scientificReference: string;
}

export function WhyThisWorksSection({ benefits, scientificReference }: WhyThisWorksSectionProps) {
  const { colors } = useThemeColors();
  return (
    <View style={s.section}>
      <Text style={[s.heading, { color: colors.text.primary }]}>Why this works</Text>
      {benefits.map((b, i) => (
        <Text key={i} style={[s.bullet, { color: colors.text.secondary }]}>
          • {b}
        </Text>
      ))}
      <Text style={[s.citation, { color: colors.text.tertiary }]}>
        📖 {scientificReference}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  bullet: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
  citation: { fontSize: 12, fontStyle: 'italic', marginTop: 8 },
  heading: { fontSize: 17, fontWeight: '600', marginBottom: 10 },
  section: { marginBottom: 16, paddingHorizontal: 16 },
});
