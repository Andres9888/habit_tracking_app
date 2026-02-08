/**
 * Empty state for SmartSuggestions
 * Standardized: FadeInUp animation, proper typography
 */

import { Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

interface EmptyStateProps {
  label: string;
}

export function EmptyState({ label }: EmptyStateProps) {
  return (
    <View className='mb-6'>
      <Text className='mb-3 text-sm font-semibold text-stone-500'>{label}</Text>
      <Animated.View
        className='items-center rounded-2xl bg-stone-50 py-6'
        entering={anim(0)}
        style={{
          shadowColor: '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
        }}
      >
        <View className='mb-3 h-12 w-12 items-center justify-center rounded-xl bg-amber-100'>
          <Sparkles color='#f59e0b' size={24} strokeWidth={1.5} />
        </View>
        <Text className='text-[17px] font-semibold text-stone-700'>
          Create Your Own
        </Text>
        <Text className='mt-1 text-[13px] text-stone-500'>
          Create your own unique habit!
        </Text>
      </Animated.View>
    </View>
  );
}
