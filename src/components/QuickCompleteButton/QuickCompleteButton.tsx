/**
 * QuickCompleteButton Component
 * Primary action button for marking a habit complete from the detail screen
 *
 * Features:
 * - One-tap completion with celebration animation
 * - Toggle state (complete/uncomplete)
 * - Haptic feedback
 * - Accessibility support
 */

import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Check, Circle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export interface QuickCompleteButtonProps {
  completedToday: boolean;
  habitId: Id<'habits'>;
  habitName: string;
  onComplete?: () => void;
  onUncomplete?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function QuickCompleteButton({
  completedToday,
  habitId,
  habitName,
  onComplete,
  onUncomplete,
}: QuickCompleteButtonProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(completedToday);

  // Animation values
  const buttonScale = useSharedValue(1);
  const checkScale = useSharedValue(completedToday ? 1 : 0);
  const checkRotation = useSharedValue(completedToday ? 0 : -90);

  // Convex mutation
  const toggleCompletionMutation = useMutation(api.tracking.toggleCompletion);
  const today = new Date().toISOString().split('T')[0];

  // Sync with prop when it changes
  React.useEffect(() => {
    setLocalCompleted(completedToday);
    checkScale.value = completedToday ? 1 : 0;
    checkRotation.value = completedToday ? 0 : -90;
  }, [completedToday]);

  const handlePress = async () => {
    if (isToggling) return;

    setIsToggling(true);

    // Haptic feedback
    if (localCompleted) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Button press animation
    buttonScale.value = withSequence(
      withTiming(0.97, { duration: 50 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );

    // Optimistic update
    const wasCompleted = localCompleted;
    setLocalCompleted(!wasCompleted);

    if (!wasCompleted) {
      // Completing - animate checkmark in
      checkScale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 180 })
      );
      checkRotation.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      onComplete?.();
    } else {
      // Uncompleting - animate checkmark out
      checkScale.value = withTiming(0, { duration: 150 });
      checkRotation.value = withTiming(-90, { duration: 150 });
      onUncomplete?.();
    }

    try {
      await toggleCompletionMutation({ date: today, habitId });
    } catch (error) {
      // Revert on error
      setLocalCompleted(wasCompleted);
      checkScale.value = wasCompleted ? 1 : 0;
      checkRotation.value = wasCompleted ? 0 : -90;
      console.error('Failed to toggle completion:', error);
    } finally {
      setTimeout(() => setIsToggling(false), 300);
    }
  };

  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: checkScale.value },
      { rotate: `${checkRotation.value}deg` },
    ],
    opacity: checkScale.value,
  }));

  return (
    <AnimatedPressable
      accessibilityHint={localCompleted ? 'Double tap to mark as not complete' : 'Double tap to mark as complete'}
      accessibilityLabel={localCompleted ? `${habitName} completed today. Tap to undo.` : `Mark ${habitName} complete for today`}
      accessibilityRole="button"
      accessibilityState={{ checked: localCompleted }}
      className={`
        flex-row items-center justify-center gap-3 rounded-2xl px-6 py-4
        ${localCompleted
          ? 'border-2 border-emerald-200 bg-emerald-50'
          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25'
        }
      `}
      disabled={isToggling}
      onPress={handlePress}
      style={buttonAnimatedStyle}
    >
      <View className="relative h-6 w-6 items-center justify-center">
        {localCompleted ? (
          <Animated.View style={checkAnimatedStyle}>
            <Check
              className="text-emerald-600"
              size={24}
              strokeWidth={3}
            />
          </Animated.View>
        ) : (
          <Circle
            className="text-white/80"
            size={22}
            strokeWidth={2}
          />
        )}
      </View>

      <Text
        className={`text-base font-semibold ${
          localCompleted ? 'text-emerald-700' : 'text-white'
        }`}
      >
        {localCompleted ? 'Completed Today ✓' : 'Mark Complete for Today'}
      </Text>
    </AnimatedPressable>
  );
}

export default QuickCompleteButton;








