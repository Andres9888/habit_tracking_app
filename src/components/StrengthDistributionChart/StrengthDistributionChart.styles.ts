import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { CHART_SIZE } from './StrengthDistributionChart.constants';

export const styles = StyleSheet.create({
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  centerLabelText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  centerLabelValue: {
    ...typography.heading1,
    color: colors.text.primary,
    fontSize: 32,
  },
  chartContainer: {
    alignItems: 'center',
    height: CHART_SIZE,
    justifyContent: 'center',
    position: 'relative',
    width: CHART_SIZE,
  },
  chartWrapper: {
    height: CHART_SIZE,
    width: CHART_SIZE,
  },
  container: {
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    height: 200,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.heading3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
});
