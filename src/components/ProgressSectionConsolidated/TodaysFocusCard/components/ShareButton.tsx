/**
 * ShareButton Component
 *
 * Optional share button for celebration state.
 */

import React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import type { FocusState } from '../../TodaysFocusCardTypes';
import { styles } from '../TodaysFocusCard.styles';

export interface ShareButtonProps {
  focusState: FocusState;
  onShare?: () => void;
  shareButtonAnimatedStyle: object;
  iconColor: string;
  onPress: () => void;
}

export function ShareButton({
  focusState,
  onShare,
  shareButtonAnimatedStyle,
  iconColor,
  onPress,
}: ShareButtonProps) {
  if (focusState !== 'celebrating' || !onShare) {
    return null;
  }

  return (
    <Animated.View style={shareButtonAnimatedStyle}>
      <Pressable
        accessibilityHint='Share your milestone achievement'
        accessibilityLabel='Share'
        accessibilityRole='button'
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        style={styles.shareButton}
        onPress={onPress}
      >
        <Ionicons color={iconColor} name='share-outline' size={20} />
      </Pressable>
    </Animated.View>
  );
}

export default ShareButton;
