/**
 * Hero icon tile — white rounded tile with a category-accent inset border, a
 * soft ring plate behind it, and the existing reanimated glow + entrance scale.
 * RN supports only one box-shadow per view, so depth is layered: glow + ring +
 * tinted shadow + inset border. (Android elevation can't tint — the ring carries
 * the accent there.)
 */

import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { withAlpha } from '@/theme/colors/alpha';
import { heroIconStyles as s } from './heroIcon.styles';

interface HeroIconTileProps {
  accent: string;
  icon: string;
  iconAnimatedStyle: object;
  iconGlowStyle: object;
}

export function HeroIconTile({
  accent,
  icon,
  iconAnimatedStyle,
  iconGlowStyle,
}: HeroIconTileProps) {
  return (
    <Animated.View style={[s.iconWrapper, iconAnimatedStyle]}>
      <Animated.View
        style={[
          s.iconGlow,
          { backgroundColor: accent, shadowColor: accent },
          iconGlowStyle,
        ]}
      />
      <View style={[s.iconRing, { backgroundColor: withAlpha(accent, 0.06) }]}>
        <View
          testID='templates-preview-icon'
          style={[
            s.iconTile,
            { borderColor: withAlpha(accent, 0.22), shadowColor: accent },
          ]}
        >
          <Text style={s.iconText}>{icon}</Text>
        </View>
      </View>
    </Animated.View>
  );
}
