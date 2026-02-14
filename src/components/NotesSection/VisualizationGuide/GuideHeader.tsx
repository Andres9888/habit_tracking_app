/**
 * Header component for VisualizationGuide
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, Sparkles, Target } from 'lucide-react-native';

interface GuideHeaderProps {
  habitName?: string;
}

export function GuideHeader({ habitName }: GuideHeaderProps) {
  return (
    <Animated.View
      className='overflow-hidden rounded-2xl p-5'
      entering={FadeInDown.delay(50).springify().damping(18)}
    >
      <LinearGradient
        colors={['#7c3aed', '#4f46e5', '#7e22ce']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='absolute inset-0 rounded-2xl'
      />
      <View className='flex-row items-start gap-3'>
        <View className='h-12 w-12 items-center justify-center rounded-2xl bg-white/20'>
          <Eye className='text-white' size={24} />
        </View>
        <View className='flex-1'>
          <Text className='text-lg font-bold text-white'>
            Goal Visualization
          </Text>
          <Text className='mt-0.5 text-sm text-violet-100'>
            Science-backed techniques from neuroscience research
          </Text>
        </View>
      </View>
      <View className='mt-4 flex-row items-center gap-2 rounded-xl bg-white/10 p-3'>
        <Sparkles className='text-amber-300' size={16} />
        <Text className='flex-1 text-xs leading-relaxed text-white/90'>
          <Text className='font-semibold'>
            Based on Andrew Huberman's research:{' '}
          </Text>
          How you visualize goals dramatically affects whether you achieve them.
        </Text>
      </View>
      {habitName && (
        <View className='mt-3 flex-row items-center gap-2'>
          <Target className='text-violet-200' size={14} />
          <Text className='text-xs text-violet-200'>
            Apply these techniques to:{' '}
            <Text className='font-medium text-white'>{habitName}</Text>
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
