/**
 * Social proof section shared across paywall variants
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

export function SocialProofSection({ dark = false }: { dark?: boolean }) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='mb-4 items-center'>
      <View className='flex-row items-center gap-1'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} color={themeColors.status.warning} fill={themeColors.status.warning} size={iconSizes.small} />
        ))}
      </View>
      <Text
        className={`mt-1 text-center text-xs ${dark ? 'text-white/50' : ''}`}
        style={dark ? undefined : { color: themeColors.text.secondary }}
      >
        Loved by 10,000+ people building lasting habits
      </Text>
    </View>
  );
}
