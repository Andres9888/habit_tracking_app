import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface HowYoullDoItSectionProps {
  cue: string;
  startSmall: string;
  tip?: string;
}

export function HowYoullDoItSection({ cue, startSmall, tip }: HowYoullDoItSectionProps) {
  const { colors } = useThemeColors();
  return (
    <View style={s.section}>
      <Text style={[s.heading, { color: colors.text.primary }]}>How you'll do it</Text>
      <Text style={[s.label, { color: colors.text.secondary }]}>Your cue</Text>
      <Text style={[s.body, { color: colors.text.primary }]}>{cue}</Text>
      <Text style={[s.label, { color: colors.text.secondary }]}>Start small</Text>
      <Text style={[s.body, { color: colors.text.primary }]}>{startSmall}</Text>
      {tip ? (
        <>
          <Text style={[s.label, { color: colors.text.secondary }]}>Tip</Text>
          <Text style={[s.body, { color: colors.text.primary }]}>{tip}</Text>
        </>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  body: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  heading: { fontSize: 17, fontWeight: '600', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 2, textTransform: 'uppercase' },
  section: { marginBottom: 16, paddingHorizontal: 16 },
});
