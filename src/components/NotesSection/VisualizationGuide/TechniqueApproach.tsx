/**
 * TechniqueApproach - Reusable component for effective/mistake technique sections
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Lightbulb, AlertTriangle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

interface TechniqueApproachProps {
  type: 'effective' | 'mistake';
  icon: React.ReactNode;
  description: string;
  example: string;
  why: string;
}

export function TechniqueApproach({
  type,
  icon,
  description,
  example,
  why,
}: TechniqueApproachProps) {
  const { colors: themeColors } = useThemeColors();
  const isEffective = type === 'effective';
  const iconColorValue = isEffective ? themeColors.status.warning : themeColors.status.error;
  const label = isEffective ? '✓ Effective Approach' : '✗ Common Mistake';
  const whyLabel = isEffective ? 'Why it works: ' : 'Why to avoid: ';

  return (
    <View className='mt-4'>
      <View className='mb-2 flex-row items-center gap-2'>
        {icon}
        <Text className='text-sm font-semibold' style={{ color: isEffective ? themeColors.status.successText : themeColors.status.errorText }}>{label}</Text>
      </View>
      <View className='rounded-xl p-3' style={{ backgroundColor: isEffective ? themeColors.status.successLight : themeColors.status.errorLight }}>
        <Text className='text-sm leading-relaxed' style={{ color: themeColors.text.primary }}>
          {description}
        </Text>
        <View className='mt-3 rounded-lg bg-white/80 p-2.5'>
          <Text className='text-xs italic' style={{ color: themeColors.text.primary }}>{example}</Text>
        </View>
        <View className='mt-2 flex-row items-start gap-2'>
          {isEffective ? (
            <Lightbulb className='mt-0.5' color={iconColorValue} size={iconSizes.small} />
          ) : (
            <AlertTriangle className='mt-0.5' color={iconColorValue} size={iconSizes.small} />
          )}
          <Text className='flex-1 text-xs' style={{ color: themeColors.text.primary }}>
            <Text className='font-medium'>{whyLabel}</Text>
            {why}
          </Text>
        </View>
      </View>
    </View>
  );
}
