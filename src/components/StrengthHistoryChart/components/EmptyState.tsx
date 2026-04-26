/**
 * EmptyState - Displayed when not enough data is available
 * Standardized: FadeInUp animation, icon, proper typography, dark mode
 */

import React from 'react';
import { View } from 'react-native';
import { Activity } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

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
        borderRadius: borderRadius.medium,
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
          borderRadius: borderRadius.medium,
          height: 48,
          justifyContent: 'center',
          marginBottom: 12,
          width: 48,
        }}
      >
        <Activity color={isDark ? '#C4B5FD' : '#8b5cf6'} size={iconSizes.large} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.text,
          fontSize: typography.body.fontSize,
          fontWeight: fontWeights.semibold,
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
          fontFamily: fontFamilies.primary.text,
          fontSize: typography.caption.fontSize,
          textAlign: 'center',
        }}
      >
        Keep tracking to see your progress
      </Animated.Text>
    </View>
  );
}
