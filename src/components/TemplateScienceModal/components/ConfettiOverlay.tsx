/**
 * ConfettiOverlay - Celebration confetti animation
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ConfettiParticle } from './ConfettiParticle';
import { CONFETTI_COLORS } from '../TemplateScienceModal.utils';

interface ConfettiOverlayProps {
  visible: boolean;
}

export const ConfettiOverlay = ({ visible }: ConfettiOverlayProps) => {
  if (!visible) return null;

  return (
    <View pointerEvents='none' style={styles.confettiContainer}>
      {CONFETTI_COLORS.flatMap((color, colorIndex) =>
        Array.from({ length: 8 }).map((_value: unknown, i) => (
          <ConfettiParticle
            key={`${colorIndex}-${i}`}
            color={color}
            delay={i * 50}
            startX={-100 + colorIndex * 50 + i * 30}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
});
