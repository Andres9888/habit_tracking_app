/**
 * @fileoverview Styles for AnalyticsScreen
 * 
 * **Style organization:**
 * - container: Main ScrollView wrapper
 * - contentContainer: ScrollView content padding
 * - header: Screen title and subtitle
 * - section: Reusable section wrapper with spacing
 * - statsGrid: Grid layout for stat cards
 * - exportButton: Primary action button at bottom
 * 
 * **Design system compliance:**
 * - Typography scale: heading1 (34px), heading3 (22px), body (17px), button (17px)
 * - Spacing: Theme spacing tokens (xs, sm, md, lg, xl, 2xl)
 * - Colors: Theme colors (primary, text, surface)
 * - Border radius: 12px for buttons
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing['2xl'],
  },
  exportButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  exportButtonText: {
    ...typography.button,
    color: colors.surface,
    marginLeft: spacing.sm,
  },
  header: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  headerTitle: {
    ...typography.heading1,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
});
