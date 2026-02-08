/**
 * HabitRankingsList EmptyState
 * Standardized: FadeInUp animation, Lucide icon, proper typography
 */

import React from 'react';
import { View, Text } from 'react-native';
import { ListOrdered } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  return (
    <View className='items-center justify-center px-6 py-12'>
      <Animated.View
        className='mb-4 h-20 w-20 items-center justify-center rounded-2xl bg-violet-50'
        entering={anim(0)}
        style={{
          shadowColor: '#8b5cf6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <ListOrdered color='#8b5cf6' size={40} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        className='mb-2 text-center font-bold text-stone-900'
        entering={anim(60)}
        style={{ fontSize: 22, letterSpacing: -0.5 }}
      >
        No Habits to Rank Yet
      </Animated.Text>
      <Animated.Text
        className='text-center text-[17px] leading-[22px] text-stone-500'
        entering={anim(120)}
        style={{ maxWidth: 280 }}
      >
        Complete some habits to see your rankings here
      </Animated.Text>
    </View>
  );
}
