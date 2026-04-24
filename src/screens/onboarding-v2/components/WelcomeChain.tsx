import { View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { getMaterialTier } from '@/components/HabitChainVisualizer/materialTier';
import { durations, enterEasing } from '@/theme/animations';

const COPPER = getMaterialTier(0).tierColor;
const GOLD = getMaterialTier(60).tierColor;
const NEUTRAL = '#9CA3AF';

const CELLS = [COPPER, COPPER, NEUTRAL, NEUTRAL, NEUTRAL, GOLD, GOLD] as const;
const STAGGER_MS = 70;

export function WelcomeChain() {
  const reduceMotion = useReducedMotion();

  return (
    <View
      accessibilityLabel="A seven-link chain, copper growing to gold."
      accessibilityRole="image"
      accessible
      style={{ flexDirection: 'row', gap: 6, width: '100%' }}
    >
      {CELLS.map((color, i) => (
        <Animated.View
          entering={
            reduceMotion
              ? undefined
              : FadeIn.duration(durations.enter).delay(i * STAGGER_MS).easing(enterEasing)
          }
          key={i}
          style={{
            aspectRatio: 1,
            backgroundColor: color,
            borderRadius: 10,
            flex: 1,
          }}
        />
      ))}
    </View>
  );
}
