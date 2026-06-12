/**
 * StickActions — primary "Lock it in" CTA + quiet skip link
 * for the Make-It-Stick sheet.
 */

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

interface StickActionsProps {
  onLockIn: () => void;
  onSkip: () => void;
  saving: boolean;
}

export function StickActions({ onLockIn, onSkip, saving }: StickActionsProps) {
  const { colors } = useThemeColors();

  return (
    <>
      <Pressable
        accessibilityLabel='Lock in your habit cue'
        accessibilityRole='button'
        disabled={saving}
        style={[
          s.cta,
          { backgroundColor: colors.primary[600], opacity: saving ? 0.6 : 1 },
        ]}
        onPress={onLockIn}
      >
        {saving ? (
          <View style={s.ctaContent}>
            <ActivityIndicator color={colors.text.inverse} size='small' />
            <Text style={[s.ctaText, { color: colors.text.inverse }]}>
              Saving…
            </Text>
          </View>
        ) : (
          <Text style={[s.ctaText, { color: colors.text.inverse }]}>
            Lock it in
          </Text>
        )}
      </Pressable>
      <Pressable
        accessibilityLabel='Skip for now'
        accessibilityRole='button'
        onPress={onSkip}
      >
        <Text style={[s.skip, { color: colors.text.secondary }]}>
          Skip for now
        </Text>
      </Pressable>
    </>
  );
}

const s = StyleSheet.create({
  cta: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    height: 52,
    justifyContent: 'center',
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
  },
  ctaContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ctaText: {
    ...typography.button,
  },
  skip: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    textAlign: 'center',
  },
});
