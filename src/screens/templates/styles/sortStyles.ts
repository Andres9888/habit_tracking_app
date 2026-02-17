import { StyleSheet } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';

export const createSortStyles = (c: SemanticColors) =>
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
      backgroundColor: c.card,
      borderColor: c.border,
      borderRadius: 12,
      borderWidth: 1,
      elevation: 8,
      left: 0,
      marginTop: 4,
      minWidth: 140,
      overflow: 'hidden',
      position: 'absolute',
      shadowColor: c.text.primary,
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
      backgroundColor: c.primary[100],
    },
    sortDropdownOptionText: {
      color: c.text.primary,
      fontSize: 17,
      fontWeight: '500',
    },
    sortDropdownOptionTextSelected: {
      color: c.primary[600],
      fontWeight: '600',
    },
  });
