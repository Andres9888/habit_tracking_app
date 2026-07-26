import type { SemanticColors } from '@/theme/darkColors';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

export function createDashboardMetricStyles(colors: SemanticColors) {
  return {
    metricLabel: {
      color: colors.text.secondary,
      fontSize: 10,
      marginTop: 4,
      textAlign: 'center' as const,
    },
    metricTile: {
      alignItems: 'center' as const,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 14,
    },
    metricValue: {
      color: colors.text.primary,
      fontFamily: fontFamilies.monospace,
      fontSize: 20,
      fontWeight: fontWeights.bold,
    },
    metricsRow: {
      flexDirection: 'row' as const,
      gap: 8,
      marginBottom: spacing.md,
    },
  };
}
