/**
 * Benefits variant header component
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import type { VariantConfig } from './PremiumPaywall.types';
import { iconSizes } from '@/theme/iconSizes';

interface BenefitsHeaderProps {
  config: VariantConfig;
  onClose: () => void;
}

export function BenefitsHeader({ config, onClose }: BenefitsHeaderProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between border-b px-4 pb-3 pt-4' style={{ borderColor: themeColors.border, backgroundColor: themeColors.card }}>
      <View className='flex-row items-center gap-2'>
        <LinearGradient
          className='h-8 w-8 items-center justify-center rounded-full'
          colors={[config.gradientColors[0], config.gradientColors[1]]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        >
          <Crown color={themeColors.text.inverse} size={iconSizes.small} />
        </LinearGradient>
        <Text className='text-lg font-bold' style={{ color: themeColors.text.primary }}>Premium Features</Text>
      </View>
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-8 w-8 items-center justify-center rounded-full'
        style={{ backgroundColor: themeColors.background }}
        hitSlop={12}
        onPress={onClose}
      >
        <X color={themeColors.text.secondary} size={iconSizes.large} />
      </Pressable>
    </View>
  );
}
