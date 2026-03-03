/**
 * PerformanceDashboard Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows, spacing } from '@/theme/spacing';

export const dashboardStyles = StyleSheet.create({
  container: { position: 'absolute', zIndex: 9999 },
  content: { gap: spacing.sm },
  dashboard: {
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    padding: spacing.md,
    ...shadows.modal,
  },
  miniMetrics: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
});
