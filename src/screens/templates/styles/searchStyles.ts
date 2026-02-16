import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const createSearchStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    searchBar: {
      alignItems: 'center',
      backgroundColor: tc.searchBg,
      borderColor: tc.searchBorder,
      borderRadius: 12,
      borderWidth: 1.5,
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 11,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
    },
    searchSection: {
      paddingHorizontal: 20,
    },
  });

/** @deprecated Use createSearchStyles(themeColors) */
export const searchStyles = createSearchStyles({
  searchBg: '#fff', searchBorder: '#e7e5e4',
} as any);
