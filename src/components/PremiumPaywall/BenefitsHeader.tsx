/**
 * Benefits variant header component — dark mode aware
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import type { VariantConfig } from './PremiumPaywall.types';

interface BenefitsHeaderProps {
  config: VariantConfig;
  onClose: () => void;
}

export function BenefitsHeader({ config, onClose }: BenefitsHeaderProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      className='flex-row items-center justify-between border-b px-4 pb-3 pt-4'
      style={{
        backgroundColor: isDark ? colors.card : '#ffffff',
        borderColor: isDark ? colors.cardBorder : '#e7e5e4',
      }}
    >
      <View className='flex-row items-center gap-2'>
        <LinearGradient
          className='h-8 w-8 items-center justify-center rounded-full'
          colors={[config.gradientColors[0], config.gradientColors[1]]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        >
          <Crown color='#ffffff' size={16} />
        </LinearGradient>
        <Text
          className='text-lg font-bold'
          style={{ color: colors.text.primary }}
        >
          Premium Features
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-8 w-8 items-center justify-center rounded-full'
        hitSlop={12}
        style={{ backgroundColor: isDark ? colors.gray[200] : '#f5f5f4' }}
        onPress={onClose}
      >
        <X color={colors.text.tertiary} size={24} />
      </Pressable>
    </View>
  );
}
