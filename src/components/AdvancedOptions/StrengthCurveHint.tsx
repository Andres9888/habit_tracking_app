/* eslint-disable max-lines */
/** Center-alert explaining habit strength curve mechanics. */
import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Modal from '@/components/Modal';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { borderRadius, spacing } from '@/theme/spacing';
import { STRENGTH_CURVE_PICKER_COPY } from '@/screens/StrengthCurvePicker/StrengthCurvePicker.copy';

const BULLETS = [
  'Check in on schedule — strength fills up',
  'Miss a day — strength dips (amount depends on tier)',
  'Tier sets how fast you build and recover',
] as const;

interface StrengthCurveHintProps {
  visible: boolean;
  onClose: () => void;
  onLearnMore: () => void;
}

export const StrengthCurveHint = memo(function StrengthCurveHint({
  visible,
  onClose,
  onLearnMore,
}: StrengthCurveHintProps) {
  const { colors } = useThemeColors();

  return (
    <Modal variant='centerAlert' visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Strength curve
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {STRENGTH_CURVE_PICKER_COPY.heroSubtitle}
        </Text>
        {BULLETS.map((line) => (
          <Text
            key={line}
            style={[styles.bullet, { color: colors.text.secondary }]}
          >
            {'• '}
            {line}
          </Text>
        ))}
        <Pressable
          accessibilityRole='button'
          style={[styles.button, { backgroundColor: colors.primary[500] }]}
          onPress={onClose}
        >
          <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
            Got it
          </Text>
        </Pressable>
        <Pressable
          accessibilityHint='Opens detailed strength curve visualization'
          accessibilityLabel='Learn more about strength curve'
          accessibilityRole='button'
          style={[styles.ghostButton, { borderColor: colors.border }]}
          onPress={onLearnMore}
        >
          <Text style={[styles.ghostText, { color: colors.primary[600] }]}>
            Learn more
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  body: { alignItems: 'stretch', width: '100%' },
  title: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 18,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  bullet: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.semibold,
  },
  ghostButton: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  ghostText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.semibold,
  },
});
