/**
 * Circular back button for the drill-down header — glass fill so it reads on
 * top of the warm hero gradient.
 *
 * Sits top-left, opposite the X. The two are different destinations, not two
 * ways to do the same thing: back returns to the Habit Library with its
 * scroll and filters intact, the X leaves for the home screen. The labels say
 * so explicitly, because "Back" and "Close" alone don't distinguish them for
 * anyone navigating by screen reader.
 *
 * 44×44 matches ModalCloseButton and the Apple HIG minimum; the hitSlop is on
 * top of that because the button sits near the screen edge under the status
 * bar, where thumb accuracy is worst.
 */

import React from 'react';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { iconSizes } from '@/theme/iconSizes';
import { borderRadius } from '@/theme/spacing';
import { AnimatedPressable } from '../../ui/AnimatedPressable';

interface ModalBackButtonProps {
  color: string;
  backgroundColor: string;
  onBack: () => void;
}

export function ModalBackButton({
  color,
  backgroundColor,
  onBack,
}: ModalBackButtonProps) {
  return (
    <AnimatedPressable
      accessibilityHint='Returns to the habit library where you left off'
      accessibilityLabel='Back to habit library'
      accessibilityRole='button'
      hitSlop={8}
      testID='templates-preview-back'
      style={[s.backButton, { backgroundColor }]}
      onPress={onBack}
    >
      <ChevronLeft color={color} size={iconSizes.large} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}

const s = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
