/**
 * EmptyState - Displayed when no trend data is available
 * Standardized: FadeInUp animation, icon, proper typography, dark mode
 */

import React from 'react';
import { View } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights } from '@/theme/typography';
import { enterEasing } from '@/theme/animations';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).easing(enterEasing);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
          borderRadius: borderRadius.medium,
          height: 64,
          justifyContent: 'center',
          marginBottom: 16,
          shadowColor: '#10b981',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 64,
        }}
      >
        <TrendingUp color={isDark ? '#6EE7B7' : '#10b981'} size={iconSizes.xl} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          ...typography.heading2,
          color: colors.text.primary,
          fontWeight: fontWeights.bold,
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        No Trend Data Yet
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          ...typography.body,
          color: colors.text.secondary,
          lineHeight: 22,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        Track habits for at least 7 days to see trends
      </Animated.Text>
    </View>
  );
}
