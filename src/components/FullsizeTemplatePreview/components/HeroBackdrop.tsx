/**
 * Single gradient painted behind the ModalHeader and the hero content,
 * extending the hero's color wash under the notch / status bar with no
 * internal seams. HeroSection renders its content transparently on top
 * of this backdrop so there is only one gradient in the stack.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { buildHeroGradient } from '../utils/heroGradient';

interface HeroBackdropProps {
  iconColor: string;
  topInset: number;
}

const HERO_REGION_HEIGHT = 360;

export function HeroBackdrop({ iconColor, topInset }: HeroBackdropProps) {
  const height = topInset + HERO_REGION_HEIGHT;
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

const s = StyleSheet.create({
  backdrop: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
});
