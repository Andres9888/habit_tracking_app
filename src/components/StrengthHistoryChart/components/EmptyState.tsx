/**
 * EmptyState - Displayed when not enough data is available
 * Dark mode aware via useThemeColors
 */

import React from 'react';
import { View } from 'react-native';
import { Activity } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

interface EmptyStateProps {
  height: number;
}

export function EmptyState({ height }: EmptyStateProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      style={{
        height,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: colors.gray[100],
        paddingHorizontal: 24,
      }}
    >
      <Animated.View
        entering={anim(0)}
        style={{
          marginBottom: 12,
          height: 48,
          width: 48,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: isDark ? '#2E1065' : '#EDE9FE',
        }}
      >
        <Activity color={isDark ? '#A78BFA' : '#8b5cf6'} size={24} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{ marginBottom: 4, textAlign: 'center', fontWeight: '600', color: colors.text.primary, fontSize: 17 }}
      >
        Not Enough Data Yet
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{ textAlign: 'center', fontSize: 13, color: colors.text.secondary }}
      >
        Keep tracking to see your progress
      </Animated.Text>
    </View>
  );
}
