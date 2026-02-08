/** PausedEmptyState - Empty state for paused habits */
import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const anim = FadeInDown.duration(280).delay(60).springify().damping(18);

export function PausedEmptyState() {
  return (
    <Animated.View className='items-center gap-3 py-12' entering={anim}>
      <Text style={{ fontSize: 48 }}>⏸️</Text>
      <Text
        className='font-semibold text-stone-900'
        style={{ fontSize: 22, letterSpacing: -0.35 }}
      >
        No paused habits
      </Text>
      <Text className='text-stone-500' style={{ fontSize: 17, lineHeight: 22 }}>
        Paused habits will appear here
      </Text>
    </Animated.View>
  );
}
