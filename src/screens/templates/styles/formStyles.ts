import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const createFormStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    charCount: {
      color: tc.formPlaceholder,
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
      borderColor: tc.formSubmitBorder,
      borderWidth: 3,
    },
    inputLabel: {
      color: tc.formInputText,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 16,
    },
    inputWrapper: {
      marginTop: 8,
      position: 'relative',
    },
    nameInput: {
      backgroundColor: tc.formInputBg,
      borderColor: tc.formInputBorder,
      borderRadius: 12,
      borderWidth: 1,
      fontSize: 17,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    reminderChip: {
      borderColor: tc.formInputBorder,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    reminderChipActive: {
      backgroundColor: tc.formSubmitBg,
      borderColor: tc.formSubmitBorder,
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

/** @deprecated Use createFormStyles(themeColors) */
export const formStyles = createFormStyles({
  formPlaceholder: '#a8a29e', formInputText: '#475467', formInputBg: '#fff',
  formInputBorder: '#e7e5e4', formSubmitBg: '#111827', formSubmitBorder: '#111827',
} as any);
