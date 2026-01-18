import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  charCount: {
    color: '#a8a29e',
    fontSize: 12,
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
    height: 36,
    width: 36,
  },
  colorSwatchActive: {
    borderColor: '#111827',
    borderWidth: 3,
  },
  inputLabel: {
    color: '#475467',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
  },
  inputWrapper: {
    marginTop: 8,
    position: 'relative',
  },
  nameInput: {
    backgroundColor: '#fff',
    borderColor: '#e7e5e4',
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reminderChip: {
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reminderChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
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
