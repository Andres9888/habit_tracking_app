import { memo, useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Check } from 'lucide-react-native';

import type { Habit } from '../../features/habits/types';

interface HabitDayToggleRowProps {
  /** The habit to display */
  habit: Habit;
  /** Whether this habit is completed on the selected date */
  isCompleted: boolean;
  /** Callback when the toggle is pressed */
  onToggle: () => Promise<void>;
  /** Whether the toggle is currently loading */
  isLoading?: boolean;
  /** Whether to reduce motion for animations */
  reduceMotion?: boolean;
}

/**
 * HabitDayToggleRow - A single habit row with toggle checkbox.
 *
 * Features:
 * - Displays habit emoji and name
 * - Animated checkbox toggle with spring animation
 * - Loading state with spinner
 * - Accessibility support with proper roles and labels
 * - Haptic feedback (handled by parent)
 *
 * Design specs:
 * - Row height: ~56px padding
 * - Checkbox: 24x24, rounded-lg
 * - Completed: bg-emerald-500 with white checkmark
 * - Incomplete: border-2 border-stone-300, white fill
 */
function HabitDayToggleRowComponent({
  habit,
  isCompleted,
  onToggle,
  isLoading = false,
  reduceMotion = false,
}: HabitDayToggleRowProps) {
  const [isToggling, setIsToggling] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkScaleAnim = useRef(
    new Animated.Value(isCompleted ? 1 : 0)
  ).current;

  // Animate checkbox scale when completed state changes
  const animateCheckbox = useCallback(
    (toCompleted: boolean) => {
      if (reduceMotion) {
        checkScaleAnim.setValue(toCompleted ? 1 : 0);
        return;
      }

      Animated.spring(checkScaleAnim, {
        friction: 8,
        tension: 200,
        toValue: toCompleted ? 1 : 0,
        useNativeDriver: true,
      }).start();
    },
    [checkScaleAnim, reduceMotion]
  );

  const handlePress = useCallback(async () => {
    if (isLoading || isToggling) return;

    setIsToggling(true);

    // Press feedback animation
    if (!reduceMotion) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          duration: 50,
          easing: Easing.out(Easing.quad),
          toValue: 0.95,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          friction: 8,
          tension: 200,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Optimistically animate the checkbox
    animateCheckbox(!isCompleted);

    try {
      await onToggle();
    } catch {
      // Revert animation on error
      animateCheckbox(isCompleted);
    } finally {
      setIsToggling(false);
    }
  }, [
    isLoading,
    isToggling,
    isCompleted,
    onToggle,
    reduceMotion,
    scaleAnim,
    animateCheckbox,
  ]);

  const accessibilityLabel = `${habit.name}, ${isCompleted ? 'completed' : 'not completed'}`;
  const accessibilityHint = 'Double tap to toggle completion';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='checkbox'
        accessibilityState={{
          checked: isCompleted,
          disabled: isLoading || isToggling,
        }}
        className='flex-row items-center gap-3 rounded-2xl bg-stone-50/80 px-4 py-3.5 active:bg-stone-100'
        disabled={isLoading || isToggling}
        onPress={handlePress}
      >
        {/* Habit emoji */}
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm'>
          <Text className='text-[20px]'>{habit.emoji || '🎯'}</Text>
        </View>

        {/* Habit name */}
        <Text
          className='flex-1 text-[15px] font-medium text-stone-800'
          numberOfLines={1}
        >
          {habit.name}
        </Text>

        {/* Checkbox / Loading spinner */}
        {isLoading || isToggling ? (
          <View className='h-6 w-6 items-center justify-center'>
            <ActivityIndicator color='#78716c' size='small' />
          </View>
        ) : (
          <View
            className={`h-6 w-6 items-center justify-center rounded-lg ${
              isCompleted
                ? 'bg-emerald-500'
                : 'border-2 border-stone-300 bg-white'
            }`}
            style={{
              // Subtle shadow for depth
              ...(isCompleted && {
                elevation: 2,
                shadowColor: '#10b981',
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
              }),
            }}
          >
            <Animated.View
              style={{
                opacity: checkScaleAnim,
                transform: [{ scale: checkScaleAnim }],
              }}
            >
              <Check color='#ffffff' size={14} strokeWidth={3} />
            </Animated.View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export const HabitDayToggleRow = memo(HabitDayToggleRowComponent);

export default HabitDayToggleRow;
