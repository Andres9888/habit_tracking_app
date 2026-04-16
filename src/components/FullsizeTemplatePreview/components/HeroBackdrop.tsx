/**
 * Colored gradient that paints behind the ModalHeader and the hero,
 * extending the hero color under the notch / status bar.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { buildHeroGradient } from '../utils/heroGradient';

interface HeroBackdropProps {
  iconColor: string;
  topInset: number;
}

export function HeroBackdrop({ iconColor, topInset }: HeroBackdropProps) {
  const height = topInset + HEADER_BLEED_HEIGHT;
  return (
    <LinearGradient
      colors={buildHeroGradient(iconColor)}
      end={{ x: 1, y: 1 }}
      pointerEvents='none'
      start={{ x: 0, y: 0 }}
      style={[s.backdrop, { height }]}
    />
  );
}

const HEADER_BLEED_HEIGHT = 72;

const s = StyleSheet.create({
  backdrop: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
});
