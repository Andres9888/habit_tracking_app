import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const createSortStyles = (tc: SemanticColors) =>
  StyleSheet.create({
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
      backgroundColor: tc.sortBg,
      borderColor: tc.sortBorder,
      borderRadius: 12,
      borderWidth: 1,
      elevation: 8,
      left: 0,
      marginTop: 4,
      minWidth: 140,
      overflow: 'hidden',
      position: 'absolute',
      shadowColor: tc.text.primary,
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
      backgroundColor: tc.sortActiveBg,
    },
    sortDropdownOptionText: {
      color: tc.sortActiveText,
      fontSize: 15,
      fontWeight: '500',
    },
    sortDropdownOptionTextSelected: {
      color: tc.primary[600],
      fontWeight: '600',
    },
  });

/** @deprecated Use createSortStyles(themeColors) */
export const sortStyles = createSortStyles({
  sortBg: '#ffffff', sortBorder: '#e7e5e4', sortActiveBg: '#f0fdf4',
  sortActiveText: '#374151', text: { primary: '#1c1917' } as any,
  primary: { 600: '#059669' } as any,
} as any);
