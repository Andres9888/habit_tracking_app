import { StyleSheet } from 'react-native';

import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  categoriesContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  categoriesScroll: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },
  categoryPill: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  categoryPillActive: {
    ...shadows.card,
    shadowOpacity: 0.15,
  },
  categoryPillIcon: {
    fontSize: typography.bodySmall.fontSize,
  },
  categoryPillText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
});
