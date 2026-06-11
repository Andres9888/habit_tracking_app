import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  chip: {
    ...shadows.subtle,
    alignItems: 'center',
    borderRadius: 13,
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
  progressBadge: {
    backgroundColor: 'rgba(5,150,105,0.12)',
    borderRadius: borderRadius.full,
    marginLeft: 'auto',
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  progressText: {
    color: '#047857',
    fontSize: 10.5,
    fontWeight: fontWeights.bold,
  },
});
