import { StyleSheet } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';

export const createSearchStyles = (c: SemanticColors) =>
  StyleSheet.create({
    searchBar: {
      alignItems: 'center',
      backgroundColor: c.card,
      borderColor: c.border,
      borderRadius: 12,
      borderWidth: 1.5,
      flexDirection: 'row',
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 11,
    },
    searchInput: {
      color: c.text.primary,
      flex: 1,
      fontSize: 17,
    },
    searchSection: {
      paddingHorizontal: 20,
    },
  });
