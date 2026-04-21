import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const searchStyles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    elevation: 6,
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.base,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
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
