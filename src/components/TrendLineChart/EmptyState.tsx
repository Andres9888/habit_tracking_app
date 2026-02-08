/**
 * EmptyState - Displayed when no trend data is available
 * Standardized: FadeInUp animation, icon, proper typography
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  return (
    <View className='items-center justify-center px-6 py-10'>
      {/* Icon */}
      <Animated.View
        className='mb-4 h-16 w-16 items-center justify-center rounded-xl bg-emerald-50'
        entering={anim(0)}
        style={{
          shadowColor: '#10b981',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <TrendingUp color='#10b981' size={32} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        className='mb-2 text-center font-bold text-stone-900'
        entering={anim(60)}
        style={{ fontSize: 22, letterSpacing: -0.5 }}
      >
        No Trend Data Yet
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        className='text-center text-[17px] leading-[22px] text-stone-500'
        entering={anim(120)}
        style={{ maxWidth: 280 }}
      >
        Track habits for at least 7 days to see trends
      </Animated.Text>
    </View>
  );
}
