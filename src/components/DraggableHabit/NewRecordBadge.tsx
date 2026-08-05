import React from 'react';
import { Text } from 'react-native';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme';
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
      className='mb-3 flex-row items-center justify-center gap-1.5 rounded-full py-2'
      style={[
        {
          borderColor: isDark ? colors.warning : colors.streak[300],
          borderWidth: 1,
        },
        badgeStyle,
      ]}
    >
      <LinearGradient
        className='absolute inset-0 rounded-full'
        colors={
          isDark
            ? [colors.gray[900], colors.warning]
            : [colors.warningLight, colors.streak[100]]
        }
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
      <TrendingUp
        color={isDark ? colors.streak[300] : colors.warning}
        size={iconSizes.small}
        strokeWidth={2.5}
      />
      <Text
        className='text-sm font-bold uppercase tracking-wide'
        style={{ color: isDark ? colors.streak[300] : colors.warning }}
      >
        New Personal Record! 🎉
      </Text>
    </ReAnimated.View>
  );
}
