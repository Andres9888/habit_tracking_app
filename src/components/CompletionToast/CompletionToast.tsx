/**
 * CompletionToast Component
 * Celebratory feedback toast shown after completing a habit
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CompletionToastProps } from './types';
import { COLORS } from './constants';
import { StreakBadge } from './components';
import { getStreakMessage } from './utils';
import { styles } from './styles';
import { useAppTheme } from '../../theme';
import { useCompletionToastAnimations } from './useCompletionToastAnimations';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

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
  const { triggerLightImpact, triggerSuccess } = useHapticFeedback({});
  const streakMessage = getStreakMessage(streak);

  // Haptic feedback when toast appears
  useEffect(() => {
    if (visible) {
      triggerSuccess();
    }
  }, [visible, triggerSuccess]);

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
              numberOfLines={1}
              style={[
                theme.custom.typography.body,
                styles.message,
                styles.primaryText,
                { color: COLORS.white },
              ]}
            >
              {habitName} done!
            </Text>
          </View>
          <StreakBadge streak={streak} onPress={handleBadgePress} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default CompletionToast;
