/**
 * Empty state for HabitPreview
 * Standardized: FadeInUp animation, proper typography
 */

import { Text, View } from 'react-native';
import { Wand2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const EmptyPreview = () => (
  <Animated.View className='items-center py-6' entering={anim(0)}>
    <View className='mb-3 h-12 w-12 items-center justify-center rounded-xl bg-violet-100'>
      <Wand2 color='#8b5cf6' size={24} strokeWidth={1.5} />
    </View>
    <Text className='mb-1 text-[17px] font-semibold text-stone-700'>
      Your Habit Will Appear Here
    </Text>
    <Text className='text-[13px] text-stone-500'>
      Try: "Meditate", "Run", or "Read"
    </Text>
  </Animated.View>
);
