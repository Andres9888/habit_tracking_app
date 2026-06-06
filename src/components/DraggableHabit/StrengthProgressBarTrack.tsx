/**
 * StrengthProgressBarTrack — Animated segmented fill inside the strength bar overlay.
 */

import React from 'react';
import { View } from 'react-native';
import ReAnimated, { type AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { CARD_BAR_LEFT, CARD_BAR_RIGHT } from './cardLayout.constants';

interface StrengthProgressBarTrackProps {
  progressAnimatedStyle: AnimatedStyle;
  tierFillColor: string;
}

export function StrengthProgressBarTrack({
  progressAnimatedStyle,
  tierFillColor,
}: StrengthProgressBarTrackProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      pointerEvents='none'
      style={{
        bottom: 0,
        justifyContent: 'center',
        left: CARD_BAR_LEFT,
        position: 'absolute',
        right: CARD_BAR_RIGHT,
        top: 0,
      }}
    >
      <View
        style={{
          backgroundColor: themeColors.gray[200],
          borderRadius: borderRadius.xs,
          height: 8,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
        }}
      >
        <ReAnimated.View
          style={[
            {
              backgroundColor: tierFillColor,
              borderRadius: borderRadius.xs,
              height: '100%',
            },
            progressAnimatedStyle,
          ]}
        />
        {[20, 40, 60, 80].map((pos) => (
          <View
            key={pos}
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              height: '100%',
              left: `${pos}%`,
              position: 'absolute',
              top: 0,
              width: 1,
            }}
          />
        ))}
      </View>
    </View>
  );
}
