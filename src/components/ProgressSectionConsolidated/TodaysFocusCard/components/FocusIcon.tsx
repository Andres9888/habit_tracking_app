/**
 * FocusIcon Component
 *
 * Displays the icon or badge for the current focus state.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import type {
  FocusState,
  MilestoneCelebrationConfig,
} from '../../TodaysFocusCardTypes';
import type { FocusStateConfig } from '../../TodaysFocusCardTypes';
import { styles } from '../TodaysFocusCard.styles';

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
      <Ionicons color={config.iconColor} name={config.icon as any} size={28} />
    </View>
  );
}

export default FocusIcon;
