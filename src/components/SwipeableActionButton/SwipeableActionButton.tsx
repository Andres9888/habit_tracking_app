/**
 * SwipeableActionButton Component
 *
 * A swipeable wrapper for action buttons in the Manage tab.
 * - Swipe left reveals a delete/action area
 * - Red background slides in for destructive actions
 * - Requires full swipe or tap to confirm
 * - Supports custom swipe action (delete, archive, etc.)
 */

import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import { getSwipeColors } from './styles';
import { SwipeActions } from './SwipeActions';
import { ButtonContent } from './ButtonContent';
import type { SwipeableActionButtonProps } from './types';
import { triggerHaptic } from '@/utils/haptics';

export function SwipeableActionButton({
  icon: Icon,
  label,
  subtitle,
  onPress,
  onSwipeAction,
  showChevron = false,
  variant = 'default',
  swipeEnabled = true,
  swipeIcon: SwipeIcon = Trash2,
  swipeLabel = 'Delete',
  swipeVariant = 'destructive',
}: SwipeableActionButtonProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const isDestructive = variant === 'destructive';
  const isBoost = variant === 'boost';
  const swipeColors = getSwipeColors(swipeVariant);

  // Build accessible label with context
  const accessibleLabel = subtitle
    ? `${label}. ${subtitle}${isDestructive ? '. This is a destructive action.' : ''}${swipeEnabled ? '. Swipe left to reveal action.' : ''}`
    : `${label}${isDestructive ? '. This is a destructive action.' : ''}${swipeEnabled ? '. Swipe left to reveal action.' : ''}`;

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => (
    <SwipeActions
      dragX={dragX}
      label={label}
      swipeableRef={swipeableRef}
      swipeColors={swipeColors}
      SwipeIcon={SwipeIcon}
      swipeLabel={swipeLabel}
      onSwipeAction={onSwipeAction}
    />
  );

  const handleSwipeableOpen = () => {
    triggerHaptic('heavy');
    swipeableRef.current?.close();
    onSwipeAction?.();
  };

  const button = (
    <ButtonContent
      accessibleLabel={accessibleLabel}
      Icon={Icon}
      isBoost={isBoost}
      isDestructive={isDestructive}
      label={label}
      showChevron={showChevron}
      subtitle={subtitle}
      onPress={onPress}
    />
  );

  if (!swipeEnabled || !onSwipeAction) {
    return button;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      overshootRight={false}
      renderRightActions={renderRightActions}
      rightThreshold={60}
      onSwipeableOpen={handleSwipeableOpen}
    >
      {button}
    </Swipeable>
  );
}

export default SwipeableActionButton;
