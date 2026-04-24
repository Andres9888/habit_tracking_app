/**
 * EmptyVizState - Shown when no visualization data is available
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles, AlertTriangle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';

import type { VizType } from './types';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { enterEasing } from '@/theme/animations';

interface EmptyVizStateProps {
  type: VizType;
  compact: boolean;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).easing(enterEasing);

export function EmptyVizState({ type, compact }: EmptyVizStateProps) {
  const { colors, isDark } = useThemeColors();
  const isSuccess = type === 'success';

  const accentColor = isSuccess
    ? isDark ? '#6EE7B7' : '#059669'
    : isDark ? '#FCA5A5' : '#F43F5E';
  const bgColor = isSuccess
    ? isDark ? '#064E3B' : '#ECFDF5'
    : isDark ? '#3B1A1A' : '#FFF1F2';

  if (compact) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 16 }}>
        <Text
          style={{
            color: accentColor,
            fontFamily: fontFamilies.primary.text,
            fontSize: 14,
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          {isSuccess
            ? 'Set up success visualization in the Motivation tab'
            : 'Set up failure visualization in the Motivation tab'}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: bgColor,
          borderRadius: 24,
          height: 48,
          justifyContent: 'center',
          marginBottom: 12,
          width: 48,
        }}
      >
        {isSuccess ? (
          <Sparkles color={accentColor} size={iconSizes.large} />
        ) : (
          <AlertTriangle color={accentColor} size={iconSizes.large} />
        )}
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
        No visualization set up yet
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
        Add it in the Motivation tab to see it here
      </Animated.Text>
    </View>
  );
}
