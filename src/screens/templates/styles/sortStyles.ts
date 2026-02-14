import { StyleSheet } from 'react-native';
<<<<<<< HEAD
import { colors } from '../../../theme/colors';
=======
import { typography } from '../../../../theme/typography';
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)

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
<<<<<<< HEAD
    fontSize: 17,
=======
    ...typography.bodySmall,
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
    fontWeight: '500',
  },
  sortDropdownOptionTextSelected: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});
