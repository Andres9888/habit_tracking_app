/**
 * Solid wash that paints behind the ModalHeader and up under the notch,
 * matching the exact top color of the hero gradient so there's no seam
 * between the status-bar area and the hero section.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { darkenColor } from '../../CreateHabitModal/components/StickyCreateBar/colorUtils';

interface HeroBackdropProps {
  iconColor: string;
  topInset: number;
}

const MODAL_HEADER_HEIGHT = 68;

export function HeroBackdrop({ iconColor, topInset }: HeroBackdropProps) {
  const topColor = `${darkenColor(iconColor, 15)}40`;
  const height = topInset + MODAL_HEADER_HEIGHT;
  return (
    <View
      pointerEvents='none'
      style={[s.backdrop, { backgroundColor: topColor, height }]}
    />
  );
}

const s = StyleSheet.create({
  backdrop: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
});
