/**
 * Styles for MakeItStickSheet (sheet chrome; sections own their styles).
 */

import { StyleSheet } from 'react-native';
import { FadeIn, FadeInDown } from 'react-native-reanimated';
import { durations } from '../../theme/animations';
import { borderRadius, spacing } from '../../theme/spacing';
import { fontFamilies, typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  cueHelp: {
    ...typography.caption,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  identity: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 21,
    marginTop: spacing.base,
    paddingHorizontal: spacing.xl,
    textAlign: 'center',
  },
  recap: {
    ...typography.caption,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
});

export const enterSheet = FadeIn.duration(durations.transition);
export const enterBody = FadeInDown.delay(durations.instant).duration(
  durations.enter
);
