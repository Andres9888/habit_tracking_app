import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../../theme/darkColors';

export const createStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    absoluteEmoji: {
      position: 'absolute',
    },
    container: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    dotsContainer: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
    },
    emoji: {
      fontSize: 64,
    },
    emojiContainer: {
      alignItems: 'center',
      backgroundColor: tc.authSurface,
      borderRadius: 60,
      height: 120,
      justifyContent: 'center',
      width: 120,
    },
  });
