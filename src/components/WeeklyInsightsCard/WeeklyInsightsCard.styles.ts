/**
 * WeeklyInsightsCard Styles
 *
 * Returns a factory so callers can pass in semantic theme colors for dark-mode support.
 * Static layout values (spacing, radius, typography) remain constant.
 */

import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { colors as staticColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { SemanticColors } from '../../theme/darkColors';

/**
 * Layout-only styles that don't depend on the colour theme,
 * plus legacy color styles consumed by child components (SummarySection, HabitListSection).
 * TODO: Migrate children to accept themed styles via props or context.
 */
export const styles = StyleSheet.create({
  badge: {
    backgroundColor: staticColors.strength.buildingLight,
    borderRadius: borderRadius.chip,
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  badgeText: {
    ...typography.caption,
    color: staticColors.success,
    fontSize: 10,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: staticColors.surface,
    borderRadius: borderRadius.button,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  sectionContent: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  sectionHeaderLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: staticColors.text.primary,
    marginLeft: spacing.sm,
  },
});

/**
 * Build theme-aware styles.
 * Call inside the component with `useThemeColors().colors`.
 */
export function themedStyles(c: SemanticColors) {
  return StyleSheet.create({
    archiveButton: {
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: borderRadius.button,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: spacing.md,
      padding: spacing.md,
    } as ViewStyle,
    archiveButtonText: {
      ...typography.body,
      color: c.text.secondary,
      marginLeft: spacing.sm,
    } as TextStyle,
    generatedDate: {
      ...typography.caption,
      color: c.text.tertiary,
      marginBottom: spacing.lg,
      textAlign: 'center',
    } as TextStyle,
    loadingContainer: {
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: borderRadius.button,
      justifyContent: 'center',
      padding: spacing.xl,
    } as ViewStyle,
    loadingText: {
      ...typography.body,
      color: c.text.secondary,
    } as TextStyle,
    section: {
      backgroundColor: c.card,
      borderRadius: borderRadius.button,
      marginBottom: spacing.md,
      overflow: 'hidden',
    } as ViewStyle,
    sectionTitle: {
      ...typography.bodyBold,
      color: c.text.primary,
      marginLeft: spacing.sm,
    } as TextStyle,
  });
}
