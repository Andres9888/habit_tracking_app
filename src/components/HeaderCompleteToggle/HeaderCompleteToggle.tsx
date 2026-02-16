/**
 * HeaderCompleteToggle Component
 * Compact completion toggle for habit detail header
 *
 * Features:
 * - Small pill design: "✓ Done" when complete, "○ Mark Done" when incomplete
 * - Haptic feedback on toggle
 * - Confetti animation on completion (respects reduce motion)
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Check, Circle } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { MiniConfettiBurst } from './MiniConfettiBurst';
import { useHeaderToggle } from './useHeaderToggle';
import { styles } from './styles';
import type { HeaderCompleteToggleProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HeaderCompleteToggle({
  completedToday,
  habitId,
  habitName,
  onComplete,
  onUncomplete,
}: HeaderCompleteToggleProps) {
  const { isDark } = useThemeColors();
  const { isToggling, localCompleted, showConfetti, buttonScale, handlePress } =
    useHeaderToggle({
      completedToday,
      habitId,
      onComplete,
      onUncomplete,
    });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: buttonScale.value ?? 1 }],
    };
  });

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
        accessibilityRole='button'
        accessibilityState={{ checked: localCompleted }}
        className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${
          localCompleted
            ? 'bg-emerald-500 shadow-sm'
            : isDark
              ? 'border-2 border-emerald-600 bg-emerald-950'
              : 'border-2 border-emerald-400 bg-emerald-50'
        } `}
        disabled={isToggling}
        style={buttonAnimatedStyle}
        onPress={handlePress}
      >
        {localCompleted ? (
          <>
            <Check className='text-white' size={14} strokeWidth={3} />
            <Text className='text-xs font-semibold text-white'>Done</Text>
          </>
        ) : (
          <>
            <Circle className={isDark ? 'text-emerald-400' : 'text-emerald-500'} size={14} strokeWidth={2} />
            <Text className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Mark Done
            </Text>
          </>
        )}
      </AnimatedPressable>
    </View>
  );
}

export default HeaderCompleteToggle;
