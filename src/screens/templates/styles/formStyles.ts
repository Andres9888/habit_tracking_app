import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';

export const formStyles = StyleSheet.create({
  charCount: {
    fontFamily: fontFamilies.primary.text,
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
    borderWidth: 3,
  },
  inputLabel: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
  },
  inputWrapper: {
    marginTop: 8,
    position: 'relative',
  },
  nameInput: {
    borderRadius: 12,
    borderWidth: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reminderChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reminderChipActive: {},
  reminderChipText: {
    fontFamily: fontFamilies.primary.text,
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
