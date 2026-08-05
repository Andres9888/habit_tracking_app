/* eslint-disable max-lines */
/**
 * FeedbackModal Styles
 */

import { StyleSheet } from 'react-native';

import { colors as appColors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius, spacing } from '../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../theme/typography';

export function useFeedbackModalStyles() {
  const { colors } = useThemeColors();

  return StyleSheet.create({
    cancelButton: {
      flex: 1,
    },
    charCount: {
      color: colors.text.secondary,
      fontFamily: fontFamilies.monospace,
      fontSize: typography.caption.fontSize,
      marginTop: spacing.xs,
      textAlign: 'right',
    },
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
      paddingBottom: spacing['2xl'],
    },
    footer: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    header: {
      marginBottom: spacing.lg,
    },
    headerSubtitle: {
      color: colors.text.secondary,
      ...typography.body,
    },
    headerTitle: {
      color: colors.text.primary,
      marginBottom: spacing.xs,
      ...typography.displayLarge,
    },
    input: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: borderRadius.button,
      borderWidth: 1,
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.text,
      fontSize: typography.body.fontSize,
      padding: spacing.base,
    },
    required: {
      color: appColors.error,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionLabel: {
      ...typography.body,
      color: colors.text.primary,
      fontWeight: fontWeights.semibold,
      marginBottom: spacing.md,
    },
    selectedIndicator: {
      borderRadius: borderRadius.xs,
      height: spacing.sm,
      width: spacing.sm,
    },
    submitButton: {
      flex: 2,
    },
    textArea: {
      maxHeight: 200,
      minHeight: 120,
    },
    typeCard: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: borderRadius.button,
      borderWidth: 1.5,
      flexDirection: 'row',
      marginBottom: spacing.md,
      padding: spacing.base,
    },
    typeCardSelected: {
      backgroundColor: colors.gray[50],
    },
    typeContent: {
      flex: 1,
    },
    typeDescription: {
      color: colors.text.secondary,
      ...typography.caption,
    },
    typeIconContainer: {
      alignItems: 'center',
      borderRadius: borderRadius.chip,
      height: 40,
      justifyContent: 'center',
      marginRight: spacing.md,
      width: 40,
    },
    typeLabel: {
      ...typography.body,
      color: colors.text.primary,
      fontWeight: fontWeights.semibold,
      marginBottom: 2,
    },
  });
}
