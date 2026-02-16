import { StyleSheet } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

export function useHeroAnimationStyles() {
  const { colors } = useThemeColors();

  return StyleSheet.create({
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
      backgroundColor: colors.card,
      borderRadius: 60,
      height: 120,
      justifyContent: 'center',
      width: 120,
    },
  });
}
