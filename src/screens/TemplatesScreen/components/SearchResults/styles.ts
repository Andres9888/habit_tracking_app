import { StyleSheet } from 'react-native';
import { spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  count: { ...typography.bodySmall, flex: 1 },
  empty: {
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  emptyDescription: {
    ...typography.bodySmall,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  emptyTitle: {
    ...typography.body,
    fontWeight: fontWeights.bold,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  wrap: { flex: 1 },
});
