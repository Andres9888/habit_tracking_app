/* eslint-disable max-lines */
/**
 * IntroStep Component
 * Introduction screen explaining the visualization exercise
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Sun,
  CloudRain,
  Sparkles,
  ChevronRight,
  Brain,
} from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { IntroStepProps } from '../types';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { durations, enterEasing } from '@/theme/animations';

export function IntroStep({ habitName, onNext }: IntroStepProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      className='flex-1 gap-6'
      entering={FadeInDown.duration(durations.enter).easing(enterEasing)}
    >
      {/* Header */}
      <View className='items-center gap-4'>
        <View className='h-20 w-20 items-center justify-center rounded-3xl'>
          <LinearGradient
            className='absolute inset-0 rounded-3xl'
            colors={['#7c3aed', '#4f46e5']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <Brain className='text-white' size={40} />
        </View>
        <Text className='text-center text-2xl font-bold tracking-tight' style={{ color: colors.text.primary }}>
          Visualization Exercise
        </Text>
        <Text className='px-4 text-center text-base' style={{ color: colors.text.secondary }}>
          Science-backed technique to boost your motivation for{' '}
          <Text className='font-semibold' style={{ color: colors.status.premiumText }}>{habitName}</Text>
        </Text>
      </View>

      {/* Explanation Cards */}
      <View className='gap-3'>
        <View
          className='flex-row items-start gap-3 rounded-2xl p-4'
          style={{ backgroundColor: colors.status.successLight }}
        >
          <View
            className='h-10 w-10 items-center justify-center rounded-xl'
            style={{ backgroundColor: colors.status.successLight }}
          >
            <Sun color={colors.status.success} size={iconSizes.medium} />
          </View>
          <View className='flex-1'>
            <Text className='text-sm font-semibold' style={{ color: colors.status.successText }}>
              Positive Visualization
            </Text>
            <Text className='mt-1 text-xs leading-relaxed' style={{ color: colors.status.successText }}>
              Imagine the best outcome. What does success look like? How will
              you feel?
            </Text>
          </View>
        </View>

        <View className='flex-row items-start gap-3 rounded-2xl p-4' style={{ backgroundColor: colors.status.errorLight }}>
          <View className='h-10 w-10 items-center justify-center rounded-xl' style={{ backgroundColor: colors.status.errorLight }}>
            <CloudRain color={colors.status.error} size={iconSizes.medium} />
          </View>
          <View className='flex-1'>
            <Text className='text-sm font-semibold' style={{ color: colors.status.errorText }}>
              Negative Visualization
            </Text>
            <Text className='mt-1 text-xs leading-relaxed' style={{ color: colors.status.errorText }}>
              Imagine failing. What are the consequences? This creates "push"
              motivation.
            </Text>
          </View>
        </View>
      </View>

      {/* Huberman Quote */}
      <View className='rounded-2xl border p-4' style={{ borderColor: colors.status.warningLight, backgroundColor: colors.status.warningLight }}>
        <View className='flex-row items-start gap-2'>
          <Sparkles className='mt-0.5' color={colors.status.warning} size={iconSizes.small} />
          <Text className='flex-1 text-sm italic leading-relaxed' style={{ color: colors.status.warningText }}>
            "Thinking about failure is actually a very effective way to reach
            your goals... it recruits the autonomic nervous system in ways that
            support action."
          </Text>
        </View>
        <Text className='mt-2 text-right text-xs font-medium' style={{ color: colors.status.warning }}>
          — Andrew Huberman
        </Text>
      </View>

      {/* Start Button */}
      <Pressable
        accessibilityLabel='Start visualization exercise'
        accessibilityRole='button'
        className='mt-auto flex-row items-center justify-center gap-2 rounded-2xl py-4 active:opacity-90'
        onPress={() => {
          triggerHaptic('toggle');
          onNext();
        }}
      >
        <LinearGradient
          className='absolute inset-0 rounded-2xl'
          colors={['#7c3aed', '#4f46e5']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        />
        <Text className='text-base font-semibold text-white'>
          Begin Exercise
        </Text>
        <ChevronRight className='text-white' size={iconSizes.medium} />
      </Pressable>
    </Animated.View>
  );
}
