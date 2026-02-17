import { StyleSheet } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';

export const createFormStyles = (c: SemanticColors) =>
  StyleSheet.create({
    charCount: {
      color: c.text.tertiary,
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
      borderColor: c.text.primary,
      borderWidth: 3,
    },
    inputLabel: {
      color: c.text.secondary,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 16,
    },
    inputWrapper: {
      marginTop: 8,
      position: 'relative',
    },
    nameInput: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderRadius: 12,
      borderWidth: 1,
      color: c.text.primary,
      fontSize: 17,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    reminderChip: {
      borderColor: c.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    reminderChipActive: {
      backgroundColor: c.text.primary,
      borderColor: c.text.primary,
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
