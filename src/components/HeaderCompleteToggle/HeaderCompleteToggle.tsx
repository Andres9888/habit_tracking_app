/**
 * HeaderCompleteToggle Component
 * Compact completion toggle for habit detail header
 *
 * Features:
 * - Small pill design: "✓ Done" when complete, "○ Mark Done" when incomplete
 * - Haptic feedback on toggle
 * - Confetti animation on completion (respects reduce motion)
 */

import React, { useState, useCallback } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Check, Circle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export interface HeaderCompleteToggleProps {
  completedToday: boolean;
  habitId: Id<'habits'>;
  habitName: string;
  onComplete?: () => void;
  onUncomplete?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Confetti particle colors - celebratory emerald/green theme
 */
const CONFETTI_COLORS = [
  '#10B981', // Emerald 500
  '#34D399', // Emerald 400
  '#6EE7B7', // Emerald 300
  '#059669', // Emerald 600
  '#F59E0B', // Amber
  '#FBBF24', // Yellow
];

const PARTICLE_COUNT = 8;

/**
 * Mini ConfettiBurst for header toggle
 */
function MiniConfettiBurst({ isActive }: { isActive: boolean }) {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    opacity: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateX: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateY: useSharedValue(0),
    angle: (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() * 0.3 - 0.15),
    // Round to avoid "Loss of precision during arithmetic conversion" error in Reanimated
    distance: Math.round(25 + Math.random() * 20),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: Math.round(3 + Math.random() * 3),
  }));

  React.useEffect(() => {
    if (isActive) {
      particles.forEach((particle, i) => {
        const delay = i * 10;
        // Round to avoid "Loss of precision during arithmetic conversion" error
        const targetX = Math.round(Math.cos(particle.angle) * particle.distance);
        const targetY = Math.round(Math.sin(particle.angle) * particle.distance) - 15;

        particle.translateX.value = 0;
        particle.translateY.value = 0;
        particle.scale.value = 0;
        particle.opacity.value = 0;

        particle.translateX.value = withDelay(
          delay,
          withSpring(targetX, { damping: 12, stiffness: 200, mass: 1 })
        );
        particle.translateY.value = withDelay(
          delay,
          withSpring(targetY, { damping: 12, stiffness: 200, mass: 1 })
        );
        particle.scale.value = withDelay(
          delay,
          withSequence(
            withSpring(1.2, { damping: 8, stiffness: 300 }),
            withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
          )
        );
        particle.opacity.value = withDelay(
          delay,
          withSequence(
            withTiming(1, { duration: 50 }),
            withDelay(150, withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) }))
          )
        );
      });
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
    <View style={styles.confettiContainer} pointerEvents="none">
      {particles.map((particle, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiParticle,
            {
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
            },
            particleStyles[i],
          ]}
        />
      ))}
    </View>
  );
}

export function HeaderCompleteToggle({
  completedToday,
  habitId,
  habitName,
  onComplete,
  onUncomplete,
}: HeaderCompleteToggleProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(completedToday);
  const [showConfetti, setShowConfetti] = useState(false);
  const reduceMotion = useReduceMotion();

  const buttonScale = useSharedValue(1);

  const toggleCompletionMutation = useMutation(api.habits.toggleHabit);
  const today = new Date().toISOString().split('T')[0];

  // Sync local state with prop - always trust the source of truth
  React.useEffect(() => {
    setLocalCompleted(completedToday);
  }, [completedToday]);

  const handlePress = useCallback(async () => {
    if (isToggling) return;

    setIsToggling(true);

    // Haptic feedback
    Haptics.impactAsync(
      localCompleted
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    );

    // Button animation
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 60 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    // Optimistic update
    const wasCompleted = localCompleted;
    setLocalCompleted(!wasCompleted);

    if (!wasCompleted && !reduceMotion) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 500);
      onComplete?.();
    } else if (wasCompleted) {
      onUncomplete?.();
    }

    try {
      await toggleCompletionMutation({ date: today, habitId });
      // Mutation succeeded - prop will update via Convex reactivity
    } catch (error) {
      // Revert on error
      setLocalCompleted(wasCompleted);
      console.error('Failed to toggle completion:', error);
    } finally {
      setIsToggling(false);
    }
  }, [isToggling, localCompleted, reduceMotion, habitId, today, toggleCompletionMutation, buttonScale, onComplete, onUncomplete]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <MiniConfettiBurst isActive={showConfetti} />

      <AnimatedPressable
        accessibilityHint={
          localCompleted
            ? 'Double tap to mark as not complete'
            : 'Double tap to mark as complete'
        }
        accessibilityLabel={
          localCompleted
            ? `${habitName} completed today. Tap to undo.`
            : `Mark ${habitName} complete for today`
        }
        accessibilityRole="button"
        accessibilityState={{ checked: localCompleted }}
        className={`
          flex-row items-center gap-1.5 rounded-full px-3 py-1.5
          ${localCompleted
            ? 'bg-emerald-500 shadow-sm'
            : 'border-2 border-emerald-400 bg-emerald-50'
          }
        `}
        disabled={isToggling}
        onPress={handlePress}
        style={buttonAnimatedStyle}
      >
        {localCompleted ? (
          <>
            <Check className="text-white" size={14} strokeWidth={3} />
            <Text className="text-xs font-semibold text-white">Done</Text>
          </>
        ) : (
          <>
            <Circle className="text-emerald-500" size={14} strokeWidth={2} />
            <Text className="text-xs font-semibold text-emerald-600">Mark Done</Text>
          </>
        )}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  confettiContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    zIndex: 100,
  },
  confettiParticle: {
    position: 'absolute',
  },
});

export default HeaderCompleteToggle;
