/**
 * QuickCompleteButton Component
 * Primary action button for marking a habit complete
 *
 * Features:
 * - Confetti burst animation on completion (T1.3)
 * - Check icon animation
 * - Haptic feedback
 * - Respects reduce motion accessibility setting
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Animated from 'react-native-reanimated';
import { Check, Zap } from 'lucide-react-native';

import type { QuickCompleteButtonProps } from './QuickCompleteButton.types';
import { ConfettiBurst } from './components';
import { styles } from './QuickCompleteButton.styles';
import { useQuickCompleteButton } from './useQuickCompleteButton';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function QuickCompleteButton({
  completedToday,
  habitId,
  habitName,
  onComplete,
  onUncomplete,
}: QuickCompleteButtonProps) {
  const {
    buttonAnimatedStyle,
    checkAnimatedStyle,
    handlePress,
    isToggling,
    localCompleted,
    showConfetti,
  } = useQuickCompleteButton({
    completedToday,
    habitId,
    onComplete,
    onUncomplete,
  });

  return (
    <View style={styles.buttonWrapper}>
      {/* Confetti burst animation on completion (T1.3) */}
      <ConfettiBurst isActive={showConfetti} />

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
        accessibilityRole='button'
        accessibilityState={{ checked: localCompleted }}
        className={`flex-row items-center justify-center gap-3 rounded-2xl px-6 py-5 ${
          localCompleted
            ? 'border-2 border-emerald-200 bg-emerald-50'
            : 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
        } `}
        disabled={isToggling}
        style={buttonAnimatedStyle}
        onPress={handlePress}
      >
        <View className='relative h-7 w-7 items-center justify-center'>
          {localCompleted ? (
            <Animated.View style={checkAnimatedStyle}>
              <Check className='text-emerald-600' size={28} strokeWidth={3} />
            </Animated.View>
          ) : (
            <Zap className='text-white' fill='white' size={24} />
          )}
        </View>

        <Text
          className={`text-[15px] font-semibold ${
            localCompleted ? 'text-emerald-700' : 'text-white'
          }`}
        >
          {localCompleted ? 'Done for Today' : 'Complete Today'}
        </Text>
      </AnimatedPressable>
    </View>
  );
}

export default QuickCompleteButton;
