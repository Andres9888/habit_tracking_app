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
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
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
  const { colors } = useThemeColors();
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
        className='flex-row items-center gap-1.5 rounded-full px-3 py-1.5'
        disabled={isToggling}
        style={[
          buttonAnimatedStyle,
          localCompleted
            ? { backgroundColor: colors.status.success, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 2 }
            : { borderWidth: 2, borderColor: colors.status.success, backgroundColor: colors.status.successLight },
        ]}
        onPress={handlePress}
      >
        {localCompleted ? (
          <>
            <Check className='text-white' size={iconSizes.small} strokeWidth={3} />
            <Text className='text-xs font-semibold text-white'>Done</Text>
          </>
        ) : (
          <>
            <Circle color={colors.status.success} size={iconSizes.small} strokeWidth={2} />
            <Text className='text-xs font-semibold' style={{ color: colors.status.success }}>
              Mark Done
            </Text>
          </>
        )}
      </AnimatedPressable>
    </View>
  );
}

export default HeaderCompleteToggle;
