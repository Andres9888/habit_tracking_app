import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const createBrowseStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    backButton: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
      marginBottom: 12,
    },
    backButtonText: {
      color: tc.browseText,
      fontSize: 15,
      fontWeight: '600',
    },
    browseContent: {
      paddingBottom: 40,
    },
  });

/** @deprecated Use createBrowseStyles(themeColors) */
export const browseStyles = createBrowseStyles({ browseText: '#374151' } as any);
