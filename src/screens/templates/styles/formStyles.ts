import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const formStyles = StyleSheet.create({
  charCount: {
    color: '#a8a29e',
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

/** Theme-aware overrides — apply on top of formStyles */
export function themedFormStyles(colors: SemanticColors) {
  return {
    charCount: { color: colors.text.tertiary },
    colorSwatchActive: { borderColor: colors.text.primary },
    inputLabel: { color: colors.text.secondary },
    nameInput: { backgroundColor: colors.card, borderColor: colors.border },
    reminderChip: { borderColor: colors.border },
    reminderChipActive: { backgroundColor: colors.text.primary, borderColor: colors.text.primary },
  } as const;
}
