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

import { useThemeColors } from '@/theme/ThemeContext';
import type { QuickCompleteButtonProps } from './QuickCompleteButton.types';
import { useQuickCompleteButton } from './useQuickCompleteButton';
import { ConfettiBurst } from './components';
import { styles } from './QuickCompleteButton.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function QuickCompleteButton({
  completedToday,
  habitId,
  habitName,
  onComplete,
  onUncomplete,
}: QuickCompleteButtonProps) {
  const { colors } = useThemeColors();
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
        className='flex-row items-center justify-center gap-3 rounded-2xl px-6 py-5'
        disabled={isToggling}
        style={[
          buttonAnimatedStyle,
          localCompleted
            ? { borderWidth: 2, borderColor: colors.status.success, backgroundColor: colors.status.successLight }
            : { backgroundColor: colors.status.success, shadowColor: colors.status.success, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
        ]}
        onPress={handlePress}
      >
        <View className='relative h-7 w-7 items-center justify-center'>
          {localCompleted ? (
            <Animated.View style={checkAnimatedStyle}>
              <Check color={colors.status.success} size={28} strokeWidth={3} />
            </Animated.View>
          ) : (
            <Zap className='text-white' fill='white' size={24} />
          )}
        </View>

        <Text
          className='text-[15px] font-semibold'
          style={{ color: localCompleted ? colors.status.successText : '#FFFFFF' }}
        >
          {localCompleted ? 'Done for Today' : 'Complete Today'}
        </Text>
      </AnimatedPressable>
    </View>
  );
}

export default QuickCompleteButton;
