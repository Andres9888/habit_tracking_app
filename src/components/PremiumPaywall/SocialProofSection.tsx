/**
 * Social proof section shared across paywall variants
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';

export function SocialProofSection({ dark = false }: { dark?: boolean }) {
  const { colors } = useThemeColors();

  // When used in blur overlay variant, text is always white
  const textColor = dark ? 'rgba(255,255,255,0.5)' : colors.text.secondary;

  return (
    <View className='mb-4 items-center'>
      <View className='flex-row items-center gap-1'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            accessibilityElementsHidden
            color='#fbbf24'
            fill='#fbbf24'
            size={14}
          />
        ))}
      </View>
      <Text
        accessibilityLabel='Rated 5 stars. Loved by 10,000 plus people building lasting habits'
        className='mt-1 text-center text-xs'
        style={{ color: textColor }}
      >
        Loved by 10,000+ people building lasting habits
      </Text>
    </View>
  );
}
