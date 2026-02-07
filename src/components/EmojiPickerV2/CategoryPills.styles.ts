import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';

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
    fontSize: 14,
  },
  categoryPillText: {
    color: colors.gray[500],
    fontSize: 14,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  categoryPillTextActive: {
    color: colors.text.inverse,
  },
});
