/**
 * DismissButton Component
 *
 * Dismiss button for celebration state acknowledgment.
 */

import React from 'react';
import { Text, type PressableStateCallbackType } from 'react-native';

import { AnimatedPressable } from '../../../ui/AnimatedPressable';
import type { FocusState } from '../../TodaysFocusCardTypes';
import { styles } from '../TodaysFocusCard.styles';

export interface DismissButtonProps {
  focusState: FocusState;
  onMilestoneCelebrated?: (milestone: number) => void;
  subTextColor: string;
  onPress: () => void;
}

export function DismissButton({
  focusState,
  onMilestoneCelebrated,
  subTextColor,
  onPress,
}: DismissButtonProps) {
  if (focusState !== 'celebrating' || !onMilestoneCelebrated) {
    return null;
  }

  return (
    <AnimatedPressable
      accessibilityHint='Dismiss celebration and continue'
      accessibilityLabel='Continue'
      accessibilityRole='button'
      style={({ pressed }: PressableStateCallbackType) => [
        styles.dismissButton,
        { opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.dismissText, { color: subTextColor }]}>
        Tap to continue
      </Text>
    </AnimatedPressable>
  );
}

export default DismissButton;
