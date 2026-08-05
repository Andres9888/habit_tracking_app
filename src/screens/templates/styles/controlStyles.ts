import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export const controlStyles = StyleSheet.create({
  controlButton: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  controlButtonActive: {},
  controlButtonText: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  controlRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  filterControlsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
});
