/**
 * EmptyVizState Component
 * Shown when no visualization data is available
 */

import React from 'react';
import { View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyVizState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
      }}
    >
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#3B1A1A' : '#FFF1F2',
          borderRadius: 24,
          height: 48,
          justifyContent: 'center',
          marginBottom: 12,
          width: 48,
        }}
      >
        <AlertTriangle color={isDark ? '#FCA5A5' : '#F43F5E'} size={iconSizes.large} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 14,
          fontWeight: fontWeights.medium,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        Imagine how you'll feel if you skip
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.tertiary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Add failure visualization in the Motivation tab
      </Animated.Text>
    </View>
  );
}
