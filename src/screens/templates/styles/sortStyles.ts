import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import type { SemanticColors } from '../../../theme/darkColors';

export const sortStyles = StyleSheet.create({
  dropdownBackdrop: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 99,
  },
  sortButtonWrapper: {
    position: 'relative',
    zIndex: 100,
  },
  sortDropdown: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    marginTop: 4,
    minWidth: 140,
    overflow: 'hidden',
    position: 'absolute',
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    top: '100%',
    zIndex: 101,
  },
  sortDropdownOption: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sortDropdownOptionSelected: {
    backgroundColor: '#f0fdf4',
  },
  sortDropdownOptionText: {
    color: '#374151',
    fontSize: 17,
    fontWeight: '500',
  },
  sortDropdownOptionTextSelected: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});

/** Theme-aware overrides — apply on top of sortStyles */
export function themedSortStyles(themeColors: SemanticColors) {
  return {
    sortDropdown: { backgroundColor: themeColors.card, borderColor: themeColors.border },
    sortDropdownOption: {},
    sortDropdownOptionSelected: { backgroundColor: themeColors.primary[100] },
    sortDropdownOptionText: { color: themeColors.text.primary },
  } as const;
}
