import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  contentContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  pill: {
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  pillText: {
    ...typography.caption,
    fontWeight: '600',
  },
});
