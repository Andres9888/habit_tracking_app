
import { StyleSheet } from 'react-native';

import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
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
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  categoryPillActive: {
    ...shadows.card,
    backgroundColor: colors.gray[900],
    shadowOpacity: 0.15,
  },
  categoryPillIcon: {
    fontSize: typography.bodySmall.fontSize,
  },
  categoryPillText: {
    color: colors.gray[500],
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  categoryPillTextActive: {
    color: colors.text.inverse,
  },
});
