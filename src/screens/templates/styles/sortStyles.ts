import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

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
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    marginTop: 4,
    minWidth: 140,
    overflow: 'hidden',
    position: 'absolute',
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
  sortDropdownOptionSelected: {},
  sortDropdownOptionText: {
    ...typography.body,
    fontWeight: fontWeights.medium,
  },
  sortDropdownOptionTextSelected: {
    color: colors.primary[600],
    fontWeight: fontWeights.semibold,
  },
});
