import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    alignItems: 'stretch',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.base,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    padding: spacing.base,
  },
  cell: {
    flex: 1,
  },
  divider: {
    width: 1,
  },
  label: {
    ...typography.caption,
    marginTop: 4,
  },
  value: {
    ...typography.displayLarge,
    fontVariant: ['tabular-nums'],
    lineHeight: 34,
  },
  valueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4,
  },
  valueSuffix: {
    fontSize: 16,
  },
});
