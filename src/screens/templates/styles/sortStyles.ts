import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

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
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    marginTop: 4,
    minWidth: 140,
    overflow: 'hidden',
    position: 'absolute',
    shadowColor: colors.gray[900],
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
    backgroundColor: colors.primary[100],
  },
  sortDropdownOptionText: {
<<<<<<< HEAD
    color: '#374151',
    fontSize: 17,
=======
    color: colors.gray[700],
    fontSize: 15,
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    fontWeight: '500',
  },
  sortDropdownOptionTextSelected: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
