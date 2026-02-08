/**
 * StreakEmptyState - Shown when no streak records exist
 * Standardized: FadeInUp animation, proper typography
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function StreakEmptyState() {
  return (
    <Animated.View
      accessibilityLabel='No streak records yet.'
      className='mt-3 items-center rounded-xl border border-stone-200 bg-white p-5'
      entering={anim(0)}
      style={{
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      }}
    >
      <View className='mb-3 h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
        <Flame color='#f97316' size={20} strokeWidth={1.5} />
      </View>
      <Text className='mb-1 text-center font-semibold text-stone-700' style={{ fontSize: 17 }}>
        No Streaks Yet
      </Text>
      <Text className='text-center text-[13px] text-stone-500'>
        Complete 2+ consecutive days to start tracking streaks
      </Text>
    </Animated.View>
  );
}
