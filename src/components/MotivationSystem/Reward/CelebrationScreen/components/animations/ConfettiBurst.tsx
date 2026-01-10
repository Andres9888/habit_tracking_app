/**
 * ConfettiBurst - Celebratory confetti animation burst
 */

import React from 'react';
import { View } from 'react-native';

import { CONFETTI_COLORS, PARTICLE_COUNT } from '../../constants';
import { ConfettiParticle } from './ConfettiParticle';

interface ConfettiBurstProps {
  reduceMotion?: boolean;
}

export function ConfettiBurst({ reduceMotion }: ConfettiBurstProps) {
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 - Math.PI / 2; // Start from top
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const delay = i * 30;

    particles.push(
      <ConfettiParticle
        key={i}
        angle={angle}
        color={color}
        delay={delay}
        reduceMotion={reduceMotion}
      />
    );
  }

  return (
    <View
      pointerEvents='none'
      style={{
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
      }}
    >
      {particles}
    </View>
  );
}
