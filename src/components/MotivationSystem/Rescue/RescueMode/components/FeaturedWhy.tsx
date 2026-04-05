import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface FeaturedWhyProps {
  why: string;
}

/**
 * FeaturedWhy - Larger, more prominent "Your Why" display for rescue
 */
export function FeaturedWhy({ why }: FeaturedWhyProps) {
  const { colors } = useThemeColors();

  return (
    <View className='rounded-2xl border-l-4 p-5' style={{ borderLeftColor: colors.status.error }}>
      <LinearGradient
        className='absolute inset-0 rounded-2xl'
        colors={['#fff1f2', '#fffbeb']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='mb-3 flex-row items-center gap-2'>
        <View className='h-10 w-10 items-center justify-center rounded-xl' style={{ backgroundColor: colors.status.errorLight }}>
          <Heart color={colors.status.error} fill={colors.status.error} size={iconSizes.medium} />
        </View>
        <Text className='text-lg font-bold' style={{ color: colors.status.errorText }}>
          Remember Your Why
        </Text>
      </View>
      <Text className='text-lg font-medium italic leading-7' style={{ color: colors.status.errorText }}>
        "{why}"
      </Text>
      <Text className='mt-3 text-sm' style={{ color: colors.status.error }}>
        This is why you started. Don't let today break your momentum.
      </Text>
    </View>
  );
}
