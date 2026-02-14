import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const formStyles = StyleSheet.create({
  charCount: {
    color: colors.gray[400],
    fontSize: 13,
    marginTop: 4,
    textAlign: 'right',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  colorSwatch: {
    borderRadius: 999,
    height: 44,
    width: 44,
  },
  colorSwatchActive: {
    borderColor: colors.gray[800],
    borderWidth: 3,
  },
  inputLabel: {
    color: colors.gray[600],
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
  },
  inputWrapper: {
    marginTop: 8,
    position: 'relative',
  },
  nameInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reminderChip: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reminderChipActive: {
    backgroundColor: colors.gray[800],
    borderColor: colors.gray[800],
  },
  reminderChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reminderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
});
