import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  chip: {
    ...shadows.subtle,
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  chipHalf: {
    flexBasis: '48%',
    flexGrow: 1,
    maxWidth: '48%',
  },
  chipWide: {
    flexBasis: '100%',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  chipSelected: {
    // Lift the chosen struggle above its neighbours once it's active.
    ...shadows.card,
  },
  emoji: {
    fontSize: 16,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold,
  },
});
