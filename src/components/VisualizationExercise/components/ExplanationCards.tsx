import React from 'react';
import { View, Text } from 'react-native';
import { Sun, CloudRain, Sparkles } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';

export function ExplanationCards() {
  const { colors } = useThemeColors();

  return (
    <>
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
    </>
  );
}
