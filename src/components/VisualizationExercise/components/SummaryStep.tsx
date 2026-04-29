/**
 * SummaryStep Component
 * Shows both visualizations and allows saving the mental contrasting exercise
 */

import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Target, Save } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { SummaryStepProps } from '../types';
import { VisualizationCards } from './VisualizationCards';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { durations, enterEasing } from '@/theme/animations';

export function SummaryStep({
  habitName,
  negativeVisualization,
  onBack,
  onSave,
  positiveVisualization,
}: SummaryStepProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View className='flex-1 gap-5' entering={FadeInDown.duration(durations.enter).easing(enterEasing)}>
      {/* Header */}
      <View className='items-center gap-3'>
        <View className='h-16 w-16 items-center justify-center rounded-2xl'>
          <LinearGradient
            className='absolute inset-0 rounded-2xl'
            colors={['#7c3aed', '#4f46e5']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <Target className='text-white' size={iconSizes.xl} />
        </View>
        <Text className='text-xl font-bold' style={{ color: colors.text.primary }}>
          Your Visualization
        </Text>
        <Text className='px-4 text-center text-sm' style={{ color: colors.text.secondary }}>
          Review your mental contrasting exercise for{' '}
          <Text className='font-semibold' style={{ color: colors.status.premiumText }}>{habitName}</Text>
        </Text>
      </View>

      {/* Visualizations */}
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <VisualizationCards
          negativeVisualization={negativeVisualization}
          positiveVisualization={positiveVisualization}
        />
      </ScrollView>

      {/* Actions */}
      <View className='flex-row gap-3'>
        <Pressable
          accessibilityLabel='Go back to edit'
          accessibilityRole='button'
          className='flex-1 items-center rounded-xl border py-3.5'
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
          onPress={() => {
            triggerHaptic('tap');
            onBack();
          }}
        >
          <Text className='text-sm font-medium' style={{ color: colors.text.secondary }}>Edit</Text>
        </Pressable>
        <Pressable
          accessibilityLabel='Save visualization'
          accessibilityRole='button'
          className='flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3.5 active:opacity-90'
          onPress={() => {
            triggerHaptic('success');
            onSave();
          }}
        >
          <LinearGradient
            className='absolute inset-0 rounded-xl'
            colors={['#7c3aed', '#4f46e5']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
          <Save className='text-white' size={iconSizes.medium} />
          <Text className='text-sm font-semibold text-white'>Save</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
