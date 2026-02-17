import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const searchStyles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e7e5e4',
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

/** Theme-aware overrides — apply on top of searchStyles */
export function themedSearchStyles(colors: SemanticColors) {
  return {
    searchBar: { backgroundColor: colors.card, borderColor: colors.border },
    searchInput: { color: colors.text.primary },
  } as const;
}
