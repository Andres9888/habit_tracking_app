/**
 * FocusIcon Component
 *
 * Displays the icon or badge for the current focus state.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type {
  FocusState,
  MilestoneCelebrationConfig,
} from '../../TodaysFocusCardTypes';
import type { FocusStateConfig } from '../../TodaysFocusCardTypes';
import { styles } from '../TodaysFocusCard.styles';
import { iconSizes } from '@/theme/iconSizes';

export interface FocusIconProps {
  focusState: FocusState;
  celebrationConfig: MilestoneCelebrationConfig | null;
  badgeAnimatedStyle: object;
  config: FocusStateConfig;
}

export function FocusIcon({
  focusState,
  celebrationConfig,
  badgeAnimatedStyle,
  config,
}: FocusIconProps) {
  if (focusState === 'celebrating' && celebrationConfig) {
    return (
      <Animated.View
        accessibilityLabel={`${celebrationConfig.name} badge`}
        style={[styles.badgeContainer, badgeAnimatedStyle]}
      >
        <Text style={styles.badgeEmoji}>{celebrationConfig.badge}</Text>
      </Animated.View>
    );
  }

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={styles.iconContainer}
    >
      <config.icon color={config.iconColor} size={iconSizes.xl} />
    </View>
  );
}

export default FocusIcon;
