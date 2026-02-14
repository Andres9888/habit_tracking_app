import { StyleSheet } from 'react-native';

import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  categoryHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  categoryHeaderText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
  },
  emojiCell: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  emojiCellSelected: {
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
    fontSize: typography.bodySmall.fontSize,
    marginTop: spacing.xs,
  },
  emptyStateTitle: {
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
