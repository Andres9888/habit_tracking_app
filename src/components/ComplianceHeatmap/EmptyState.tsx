/**
 * Empty state view for ComplianceHeatmap
 * Standardized: FadeInUp animation, icon, proper typography
 */

import React from 'react';
import { View } from 'react-native';
import { Grid3X3 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  return (
    <View className='items-center justify-center px-6 py-10'>
      <Animated.View
        className='mb-4 h-16 w-16 items-center justify-center rounded-xl bg-blue-50'
        entering={anim(0)}
        style={{
          shadowColor: '#3b82f6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <Grid3X3 color='#3b82f6' size={32} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        className='mb-2 text-center font-bold text-stone-900'
        entering={anim(60)}
        style={{ fontSize: 22, letterSpacing: -0.5 }}
      >
        No Compliance Data
      </Animated.Text>
      <Animated.Text
        className='text-center text-[17px] leading-[22px] text-stone-500'
        entering={anim(120)}
        style={{ maxWidth: 280 }}
      >
        Complete habits daily to see your compliance heatmap
      </Animated.Text>
    </View>
  );
}
