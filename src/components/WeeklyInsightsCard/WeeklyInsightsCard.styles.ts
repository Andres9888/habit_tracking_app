/**
 * WeeklyInsightsCard Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography, fontWeights } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export const styles = StyleSheet.create({
  archiveButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.button,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  archiveButtonText: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  badge: {
    backgroundColor: colors.strength.buildingLight,
    borderRadius: borderRadius.chip,
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  badgeText: {
    ...typography.caption,
    color: colors.success,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.semibold,
  },
  container: {
    flex: 1,
  },
  generatedDate: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.button,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  section: {
    backgroundColor: colors.surface,
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
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
});
