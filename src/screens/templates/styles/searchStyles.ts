import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const searchStyles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.base,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
  },
  searchSection: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
});
