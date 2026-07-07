/**
 * CompletionToast Component
 * Celebratory feedback toast shown after completing a habit
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../theme';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { isMilestoneStreak } from '../../constants/milestones';
import type { CompletionToastProps } from './types';
import { styles } from './styles';
import { COLORS } from './constants';
import { getStreakMessage } from './utils';
import { useCompletionToastAnimations } from './useCompletionToastAnimations';
import { StreakBadge } from './components';

export function CompletionToast(props: CompletionToastProps) {
  const {
    visible,
    habitName,
    streak,
    icon = '✓',
    duration = 2500,
    onDismiss,
    style,
  } = props;
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { triggerLightImpact, triggerStreak, triggerSuccess } =
    useHapticFeedback({});
  const streakMessage = getStreakMessage(streak);
  const isMilestone = isMilestoneStreak(streak);

  // Haptic feedback when toast appears — a felt double-tap on milestone days.
  useEffect(() => {
    if (visible) {
      if (isMilestone) {
        triggerStreak();
      } else {
        triggerSuccess();
      }
    }
  }, [visible, isMilestone, triggerStreak, triggerSuccess]);

  const { animatedStyle, handleDismiss, panGesture } =
    useCompletionToastAnimations({
      duration,
      onDismiss,
      visible,
    });

  if (!visible) return null;

  const handleBadgePress = () => {
    triggerLightImpact();
    handleDismiss();
  };

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <View collapsable={false}>
          <Animated.View
            accessible
            accessibilityLabel={`${habitName} completed. ${streakMessage}`}
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            style={[
              styles.toast,
              {
                backgroundColor: COLORS.successGreen,
                ...theme.custom.shadows.card,
              },
              animatedStyle,
              style,
            ]}
          >
            <View style={styles.content}>
              <Text style={styles.habitIcon}>{icon}</Text>
              <Text
                numberOfLines={isMilestone ? 2 : 1}
                style={[
                  theme.custom.typography.body,
                  styles.message,
                  styles.primaryText,
                  { color: COLORS.white },
                ]}
              >
                {isMilestone ? streakMessage : `${habitName} done!`}
              </Text>
            </View>
            <StreakBadge streak={streak} onPress={handleBadgePress} />
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

export default CompletionToast;
