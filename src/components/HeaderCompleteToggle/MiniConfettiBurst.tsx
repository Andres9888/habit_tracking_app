/**
 * Mini ConfettiBurst component for header toggle
 */

import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { CONFETTI_COLORS, PARTICLE_COUNT } from './constants';
import { styles } from './styles';
import { animateParticle } from './confettiAnimations';

interface MiniConfettiBurstProps {
  isActive: boolean;
}

export function MiniConfettiBurst({ isActive }: MiniConfettiBurstProps) {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    angle: (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() * 0.3 - 0.15),

    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],

    distance: Math.round(25 + Math.random() * 20),

    // eslint-disable-next-line react-hooks/rules-of-hooks
    opacity: useSharedValue(0),

    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale: useSharedValue(0),

    size: Math.round(3 + Math.random() * 3),

    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateX: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateY: useSharedValue(0),
  }));

  React.useEffect(() => {
    if (isActive) {
      for (const [i, particle] of particles.entries())
        animateParticle(particle, i);
    }
  }, [isActive]);

  const particleStyles = particles.map((particle) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => ({
      opacity: particle.opacity.value,
      transform: [
        { translateX: particle.translateX.value },
        { translateY: particle.translateY.value },
        { scale: particle.scale.value },
      ],
    }))
  );

  if (!isActive) return null;

  return (
    <View pointerEvents='none' style={styles.confettiContainer}>
      {particles.map((particle, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiParticle,
            {
              backgroundColor: particle.color,
              borderRadius: particle.size / 2,
              height: particle.size,
              width: particle.size,
            },
            particleStyles[i],
          ]}
        />
      ))}
    </View>
  );
}
