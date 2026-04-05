import React from 'react';
import { View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface WhySectionProps {
  why: string;
}

/**
 * WhySection - Featured display of user's "why"
 */
export function WhySection({ why }: WhySectionProps) {
  const { colors } = useThemeColors();

  return (
    <View className='rounded-2xl border-l-4 p-4' style={{ borderLeftColor: colors.status.error, backgroundColor: colors.status.errorLight }}>
      <View className='mb-2 flex-row items-center gap-2'>
        <View className='h-8 w-8 items-center justify-center rounded-lg' style={{ backgroundColor: colors.status.errorLight }}>
          <Heart color={colors.status.error} size={iconSizes.small} />
        </View>
        <Text className='font-semibold' style={{ color: colors.status.errorText }}>Your Why</Text>
      </View>
      <Text className='text-base italic leading-6' style={{ color: colors.status.errorText }}>"{why}"</Text>
    </View>
  );
}
