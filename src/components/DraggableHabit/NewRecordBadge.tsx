import React from 'react';
import { Text } from 'react-native';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';

interface NewRecordBadgeProps {
  newRecordOpacity: SharedValue<number>;
  newRecordScale: SharedValue<number>;
}

export function NewRecordBadge({
  newRecordOpacity,
  newRecordScale,
}: NewRecordBadgeProps) {
  const { isDark } = useThemeColors();

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: newRecordOpacity.value,
    transform: [{ scale: newRecordScale.value }],
  }));

  return (
    <ReAnimated.View
      className='mx-3 mb-3 flex-row items-center justify-center gap-1.5 rounded-full py-2'
      style={[
        {
          borderColor: isDark ? '#D97706' : '#fcd34d',
          borderWidth: 1,
        },
        badgeStyle,
      ]}
    >
      <LinearGradient
        className='absolute inset-0 rounded-full'
        colors={isDark ? ['#451A03', '#78350F'] : ['#fef3c7', '#fffbeb']}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
      <TrendingUp
        color={isDark ? '#FBBF24' : '#d97706'}
        size={16}
        strokeWidth={2.5}
      />
      <Text
        className='text-[13px] font-bold uppercase tracking-wide'
        style={{ color: isDark ? '#FCD34D' : '#b45309' }}
      >
        New Personal Record! 🎉
      </Text>
    </ReAnimated.View>
  );
}
