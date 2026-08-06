/**
 * HeroIconTile — the drill-down hero's 88px rounded emoji tile.
 *
 * Replaces the old 112px iconColor disc + glow: the "Habit Detail" design uses
 * one neutral cream tile so the warm gradient behind it stays the focal point.
 */

import React from 'react';
import { Text, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { heroStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';

interface HeroIconTileProps {
  icon: string;
  iconAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export function HeroIconTile({ icon, iconAnimatedStyle }: HeroIconTileProps) {
  const palette = useDetailPalette();

  return (
    <Animated.View
      testID='templates-preview-icon'
      style={[
        heroStyles.iconTile,
        { backgroundColor: palette.iconTile },
        iconAnimatedStyle,
      ]}
    >
      <Text style={heroStyles.iconText}>{icon}</Text>
    </Animated.View>
  );
}
