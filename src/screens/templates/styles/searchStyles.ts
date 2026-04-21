import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const searchStyles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    elevation: 3,
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.base,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
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
