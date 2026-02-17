import { StyleSheet } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';

export const createBrowseStyles = (c: SemanticColors) =>
  StyleSheet.create({
    backButton: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
      marginBottom: 12,
    },
    backButtonText: {
      color: c.text.primary,
      fontSize: 17,
      fontWeight: '600',
    },
    browseContent: {
      paddingBottom: 40,
    },
  });
