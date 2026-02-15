
import { StyleSheet } from 'react-native';

import { borderRadius, spacing } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  categoryHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  categoryHeaderText: {
    color: colors.gray[500],
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  container: {
    backgroundColor: colors.light.surface,
    flex: 1,
  },
  emojiCell: {
    alignItems: 'center',
    backgroundColor: colors.light.surfaceMuted,
    borderRadius: borderRadius.medium,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  emojiCellSelected: {
    backgroundColor: colors.secondary[100],
    borderColor: colors.secondary[500],
    borderWidth: 2,
  },
  emojiCellWrapper: {
    aspectRatio: 1,
    flex: 1,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  emojiText: {
    fontSize: 28,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateSubtitle: {
    color: colors.gray[400],
    fontSize: typography.bodySmall.fontSize,
    marginTop: spacing.xs,
  },
  emptyStateTitle: {
    color: colors.gray[900],
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    marginTop: spacing.md,
  },
  gridContent: {
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.lg,
  },
  placeholderCell: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});
