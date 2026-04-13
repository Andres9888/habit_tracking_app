/**
 * Key insight box component for VisualizationGuide
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

export function KeyInsightBox() {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      className='flex-row items-start gap-3 rounded-2xl border p-4'
      style={{ borderColor: colors.status.warningLight }}
      entering={FadeInDown.delay(100).springify().damping(18)}
    >
      <LinearGradient
        className='absolute inset-0 rounded-2xl'
        colors={['#fffbeb', '#fefce8']}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='h-10 w-10 items-center justify-center rounded-xl' style={{ backgroundColor: colors.status.warningLight }}>
        <Zap color={colors.status.warning} size={iconSizes.medium} />
      </View>
      <View className='flex-1'>
        <Text className='text-sm font-bold' style={{ color: colors.status.warningText }}>
          🧠 The Key Insight
        </Text>
        <Text className='mt-1 text-sm leading-relaxed' style={{ color: colors.status.warningText }}>
          Visualizing <Text className='font-semibold'>the process</Text>{' '}
          activates goal-pursuit neural circuits. Visualizing{' '}
          <Text className='font-semibold'>only the outcome</Text> can actually{' '}
          <Text className='italic'>reduce</Text> your motivation.
        </Text>
      </View>
    </Animated.View>
  );
}
