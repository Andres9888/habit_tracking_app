/**
 * Circular back button for the drill-down header — glass fill so it reads on
 * top of the warm hero gradient.
 */

import React from 'react';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { iconSizes } from '@/theme/iconSizes';
import { borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';
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
      accessibilityLabel='Back'
      accessibilityRole='button'
      testID='templates-preview-back'
      style={[s.backButton, { backgroundColor }]}
      onPress={() => {
        triggerHaptic('tap');
        onBack();
      }}
    >
      <ChevronLeft color={color} size={iconSizes.large} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}

const s = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
