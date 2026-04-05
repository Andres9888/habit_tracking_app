/**
 * ShareButton Component
 *
 * Optional share button for celebration state.
 */

import React from 'react';
import Animated from 'react-native-reanimated';
import { Share2 } from 'lucide-react-native';

import { AnimatedPressable } from '../../../ui/AnimatedPressable';
import type { FocusState } from '../../TodaysFocusCardTypes';
import { iconSizes } from '@/theme/iconSizes';
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
      <AnimatedPressable
        accessibilityHint='Share your milestone achievement'
        accessibilityLabel='Share'
        accessibilityRole='button'
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.7 : 1 }]}
        onPress={onPress}
      >
        <Share2 color={iconColor} size={iconSizes.medium} />
      </AnimatedPressable>
    </Animated.View>
  );
}

export default ShareButton;
