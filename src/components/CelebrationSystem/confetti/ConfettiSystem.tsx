/**
 * Enhanced Confetti System
 *
 * Orchestrates confetti bursts with multiple burst types,
 * physics simulation, haptic feedback, and sound effects.
 */

import { useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';

import { ConfettiParticle } from './ConfettiParticle';
import { PhysicsSimulation } from './physicsEngine';
import type { BurstType, ParticleState, ConfettiSystemProps } from './types';
import { getBurstConfig } from './burstConfigs';
import { useHaptics } from '../../../utils/haptics/useHaptics';
import { useCompletionSound } from '../../../hooks/useCompletionSound';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * ConfettiSystem - Main celebration component
 *
 * Handles particle emission, physics simulation, haptics, and audio.
 *
 * @example
 * ```tsx
 * <ConfettiSystem
 *   burstType="streakMilestone"
 *   shouldReduceMotion={false}
 *   isDarkMode={true}
 *   soundEnabled={true}
 *   hapticsEnabled={true}
 * />
 * ```
 */
export function ConfettiSystem({
  burstType,
  shouldReduceMotion,
  isDarkMode,
  dimensions = { width: screenWidth, height: screenHeight },
  soundEnabled = false,
  hapticsEnabled = true,
  origin,
}: ConfettiSystemProps) {
  const [particles, setParticles] = useState<Array<ParticleState & { color: string; shape: number }>>([]);
  const simulationRef = useRef<PhysicsSimulation | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasTriggeredEffects = useRef(false);

  const { trigger: triggerHaptics } = useHaptics({ enabled: hapticsEnabled });
  const { playCompletionSound } = useCompletionSound({
    soundEnabled,
    soundType: getBurstConfig(burstType, isDarkMode).soundType,
  });

  // Initialize simulation when burst type changes
  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const config = getBurstConfig(burstType, isDarkMode);

    // Reset simulation
    simulationRef.current = new PhysicsSimulation(config.duration, config.physics);

    // Emit particles with staggered delay
    const { particleCount, colors, darkColors, emissionDelay = 0 } = config;
    const activeColors = isDarkMode ? darkColors : colors;
    const originX = origin?.x ?? dimensions.width / 2;
    const originY = origin?.y ?? dimensions.height * 0.7;

    // Trigger haptic and sound effects on first render
    if (!hasTriggeredEffects.current && simulationRef.current) {
      triggerHaptics(config.hapticPattern);
      playCompletionSound();
      hasTriggeredEffects.current = true;
    }

    const particlesData: Array<{ color: string; shape: number; seed: number }> = [];

    for (let i = 0; i < particleCount; i++) {
      particlesData.push({
        color: activeColors[i % activeColors.length],
        shape: (i % 3) as 0 | 1 | 2, // Vary shapes
        seed: i + Math.random() * 1000,
      });
    }

    // Emit particles with delays
    particlesData.forEach((data, index) => {
      setTimeout(() => {
        if (simulationRef.current) {
          simulationRef.current.addParticle(originX, originY, data.seed);
        }
      }, index * emissionDelay);
    });

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (simulationRef.current) {
        simulationRef.current.reset();
      }
      hasTriggeredEffects.current = false;
    };
  }, [burstType, isDarkMode, shouldReduceMotion, dimensions, origin, soundEnabled, hapticsEnabled]);

  // Animation loop
  useEffect(() => {
    if (shouldReduceMotion || !simulationRef.current) {
      return;
    }

    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (simulationRef.current) {
        const updatedParticles = simulationRef.current.update(delta);
        setParticles(updatedParticles.map((p, i) => ({
          ...p,
          // Re-attach color and shape from the original particle data
          color: particles[i]?.color ?? getBurstConfig(burstType, isDarkMode).colors[0],
          shape: particles[i]?.shape ?? 0,
        })));

        // Stop animation when no particles remain
        if (!simulationRef.current.isActive()) {
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldReduceMotion, burstType, isDarkMode, particles]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={{
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      }}
    >
      {particles.map((particle, index) => (
        <ConfettiParticle
          key={`${index}-${particle.x.toFixed(0)}-${particle.y.toFixed(0)}`}
          state={particle}
          color={particle.color}
          size={6 + Math.random() * 4} // Vary sizes slightly
          shape={particle.shape as 0 | 1 | 2}
        />
      ))}
    </View>
  );
}
