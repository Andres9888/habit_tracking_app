import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const searchStyles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
  },
  searchSection: {
    paddingHorizontal: 20,
  },
});
