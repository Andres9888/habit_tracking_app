import React from 'react';
import { Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';

interface NewRecordBadgeProps {
  newRecordOpacity: Animated.Value;
  newRecordScale: Animated.Value;
}

export function NewRecordBadge({
  newRecordOpacity,
  newRecordScale,
}: NewRecordBadgeProps) {
  const { colors } = useThemeColors();
  return (
    <Animated.View
      className='mx-3 mb-3 flex-row items-center justify-center gap-1.5 rounded-full py-2'
      style={{
        borderColor: colors.status.warning.border,
        borderWidth: 1,
        opacity: newRecordOpacity,
        transform: [{ scale: newRecordScale }],
      }}
    >
      <LinearGradient
        className='absolute inset-0 rounded-full'
        colors={[colors.status.warning.bg, colors.card]}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
      <TrendingUp
        color={colors.status.warning.text}
        size={16}
        strokeWidth={2.5}
      />
      <Text
        className='text-[13px] font-bold uppercase tracking-wide'
        style={{ color: colors.status.warning.text }}
      >
        New Personal Record! 🎉
      </Text>
    </Animated.View>
  );
}
