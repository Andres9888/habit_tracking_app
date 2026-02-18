import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const TEMPLATE_ICONS = [
  '🧘',
  '💧',
  '📖',
  '🏃',
  '😴',
  '🥗',
  '✍️',
  '🧠',
  '💊',
  '🎯',
  '🌅',
  '🏋️',
];

export function TemplateGrid() {
  const { colors: themeColors } = useThemeColors();

  const dynamicStyles = StyleSheet.create({
    item: {
      alignItems: 'center',
      backgroundColor: themeColors.primary[100],
      borderRadius: 16,
      elevation: 2,
      height: 56,
      justifyContent: 'center',
      shadowColor: themeColors.text.primary,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      width: 56,
    },
  });

  return (
    <View style={styles.grid}>
      {TEMPLATE_ICONS.map((emoji, i) => (
        <Animated.View
          key={emoji}
          entering={FadeIn.delay(300 + i * 60)
            .springify()
            .damping(18)}
          style={dynamicStyles.item}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    width: 280,
  },
});
