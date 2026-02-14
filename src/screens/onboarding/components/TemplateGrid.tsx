import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { spacing, borderRadius, shadows } from '../../../theme/spacing';

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
  return (
    <View style={styles.grid}>
      {TEMPLATE_ICONS.map((emoji, i) => (
        <Animated.View
          key={emoji}
          entering={FadeIn.delay(300 + i * 60)
            .springify()
            .damping(18)}
          style={styles.item}
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
    gap: spacing.base,
    justifyContent: 'center',
    width: 280,
  },
  item: {
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: borderRadius.large,
    height: 56,
    justifyContent: 'center',
    width: 56,
    ...shadows.card,
  },
});
