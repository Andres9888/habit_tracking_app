import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const searchStyles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#fff',
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

export function themedSearchStyles(colors: SemanticColors) {
  return StyleSheet.create({
    searchBar: {
      borderColor: colors.borders.subtle,
    },
  });
}
