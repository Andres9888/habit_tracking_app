import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

const STEPS = [
  { label: 'Choose outcome', marker: '1' },
  { label: 'Preview path', marker: '2' },
  { label: 'Add one habit', marker: '3' },
] as const;

export function TransformationGuideCard() {
  const { colors } = useThemeColors();

  return (
    <View
      testID='templates-transformation-guide'
      style={[
        s.card,
        {
          backgroundColor: colors.primary[100],
          borderColor: colors.primary[300],
        },
      ]}
    >
      <Text style={[s.eyebrow, { color: colors.primary[700] }]}>
        FIND YOUR PATH
      </Text>
      <Text style={[s.title, { color: colors.text.primary }]}>
        Start with the change you want.
      </Text>
      <Text style={[s.copy, { color: colors.text.secondary }]}>
        We will narrow the library to small habits that move that outcome
        forward, so you can start without overthinking.
      </Text>
      <View style={s.steps}>
        {STEPS.map((step) => (
          <View key={step.marker} style={s.step}>
            <View
              style={[
                s.marker,
                { backgroundColor: colors.primary[600] },
              ]}
            >
              <Text style={[s.markerText, { color: colors.text.inverse }]}>
                {step.marker}
              </Text>
            </View>
            <Text style={[s.stepText, { color: colors.text.secondary }]}>
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginBottom: spacing.base,
    marginHorizontal: spacing.base,
    padding: spacing.base,
  },
  copy: { ...typography.bodySmall, lineHeight: 20, marginTop: spacing.xs },
  eyebrow: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  marker: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  markerText: { ...typography.caption, fontWeight: fontWeights.bold },
  step: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  stepText: { ...typography.caption, fontWeight: fontWeights.semibold },
  steps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  title: { ...typography.heading3, fontWeight: fontWeights.bold },
});
