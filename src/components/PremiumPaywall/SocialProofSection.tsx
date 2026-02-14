/**
 * Social proof section shared across paywall variants
 * Avatar stack + rating + user count for trust signals
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';

const AVATARS = ['😊', '💪', '🔥', '⭐', '🎯'];

export function SocialProofSection({ dark = false }: { dark?: boolean }) {
  const { colors } = useThemeColors();
  const textColor = dark ? 'rgba(255,255,255,0.6)' : colors.text.secondary;
  const subtleColor = dark ? 'rgba(255,255,255,0.4)' : colors.text.tertiary;

  return (
    <View className='mb-4 items-center py-2'>
      {/* Avatar stack */}
      <View className='mb-2 flex-row items-center'>
        {AVATARS.map((emoji, i) => (
          <View
            key={i}
            className='h-8 w-8 items-center justify-center rounded-full border-2'
            style={{
              backgroundColor: dark ? 'rgba(255,255,255,0.15)' : colors.gray[100],
              borderColor: dark ? 'rgba(0,0,0,0.3)' : colors.background,
              marginLeft: i === 0 ? 0 : -8,
              zIndex: AVATARS.length - i,
            }}
          >
            <Text className='text-sm'>{emoji}</Text>
          </View>
        ))}
        <View
          className='ml-1 rounded-full px-2 py-0.5'
          style={{ backgroundColor: dark ? 'rgba(255,255,255,0.15)' : colors.primary[100] }}
        >
          <Text
            className='text-xs font-semibold'
            style={{ color: dark ? '#34D399' : colors.primary[500] }}
          >
            10K+
          </Text>
        </View>
      </View>

      {/* Star rating */}
      <View className='mb-1 flex-row items-center gap-0.5'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} fill='#fbbf24' color='#fbbf24' size={14} />
        ))}
        <Text className='ml-1 text-xs font-semibold' style={{ color: textColor }}>
          4.8
        </Text>
      </View>
      <Text className='text-center text-xs' style={{ color: subtleColor }}>
        Trusted by 10,000+ users building lasting habits
      </Text>
    </View>
  );
}
