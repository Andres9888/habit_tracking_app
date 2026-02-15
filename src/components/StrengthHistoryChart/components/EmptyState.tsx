/**
 * EmptyState - Displayed when not enough data is available
 * Standardized: FadeInUp animation, icon, proper typography, dark mode
 */

import React from 'react';
import { View } from 'react-native';

import Animated, { FadeInUp } from 'react-native-reanimated';
import { Activity } from 'lucide-react-native';

import { useThemeColors } from '../../../theme/ThemeContext';

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
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        borderRadius: 12,
        height,
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#2E1065' : '#F5F3FF',
          borderRadius: 12,
          height: 48,
          justifyContent: 'center',
          marginBottom: 12,
          width: 48,
        }}
      >
        <Activity color={isDark ? '#C4B5FD' : '#8b5cf6'} size={24} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontSize: 17,
          fontWeight: '600',
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        Not Enough Data Yet
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Keep tracking to see your progress
      </Animated.Text>
    </View>
  );
}
