/**
 * Science box styles for FullsizeTemplatePreview
 *
 * Uses burnished gold (streak) tokens for credibility signaling.
 * Accepts dynamic colors so styles adapt to dark mode.
 */

import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';

export function createScienceStyles(colors: SemanticColors) {
  return StyleSheet.create({
    scienceBox: {
      backgroundColor: colors.status.streakLight,
      borderColor: colors.status.streakLight,
      borderRadius: borderRadius.large,
      borderWidth: 2,
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      padding: spacing.lg,
    },
    scienceDivider: {
      backgroundColor: colors.status.streakLight,
      height: 1,
      marginBottom: 12,
    },
    scienceHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    scienceIcon: {
      fontSize: typography.heading2.fontSize,
    },
    scienceLabel: {
      color: colors.status.streakText,
      fontFamily: fontFamilies.primary.text,
      fontSize: typography.caption.fontSize,
      fontWeight: fontWeights.bold,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    scienceQuote: {
      color: colors.status.streakText,
      fontFamily: fontFamilies.primary.text,
      fontSize: 13,
      fontStyle: 'italic',
      lineHeight: 24,
    },
    researchLink: {
      ...typography.caption,
      borderBottomColor: `${colors.status.streak}66`,
      borderBottomWidth: 1,
      color: colors.status.streak,
      fontWeight: fontWeights.semibold,
      marginTop: spacing.sm,
      paddingBottom: 1,
      alignSelf: 'flex-start',
    },
  });
}
