/**
 * Benefits variant header component
 * Dark-mode aware
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
  const { colors } = useThemeColors();

  return (
    <View
      className='flex-row items-center justify-between px-4 pb-3 pt-4'
      style={{
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
        <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>
          Premium Features
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-8 w-8 items-center justify-center rounded-full'
        hitSlop={12}
        onPress={onClose}
        style={{ backgroundColor: colors.gray[200] }}
      >
        <X color={colors.text.secondary} size={24} />
      </Pressable>
    </View>
  );
}
