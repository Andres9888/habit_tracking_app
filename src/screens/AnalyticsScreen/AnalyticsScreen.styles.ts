/**
 * Styles for AnalyticsScreen
 */
import { StyleSheet } from 'react-native';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { SemanticColors } from '../../theme/darkColors';

export const createStyles = (themeColors: SemanticColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: themeColors.background,
      flex: 1,
    },
    contentContainer: {
      paddingBottom: spacing['2xl'],
    },
    exportButton: {
      alignItems: 'center',
      backgroundColor: themeColors.primary[500],
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      paddingVertical: spacing.md,
    },
    exportButtonText: {
      ...typography.button,
      color: themeColors.text.inverse,
      marginLeft: spacing.sm,
    },
    header: {
      paddingBottom: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
    },
    headerSubtitle: {
      ...typography.body,
      color: themeColors.text.secondary,
      marginTop: spacing.xs,
    },
    headerTitle: {
      ...typography.heading1,
      color: themeColors.text.primary,
    },
    section: {
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    sectionTitle: {
      ...typography.heading3,
      color: themeColors.text.primary,
      marginBottom: spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.sm,
    },
  });
