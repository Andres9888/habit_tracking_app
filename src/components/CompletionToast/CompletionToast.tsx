/**
 * CompletionToast Component
 * Celebratory feedback toast shown after completing a habit
 *
 * Polish: shine sweep overlay, spring-animated streak badge, haptic feedback
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../theme';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import type { CompletionToastProps } from './types';
import { styles } from './styles';
import { COLORS } from './constants';
import { getStreakMessage } from './utils';
import { useCompletionToastAnimations } from './useCompletionToastAnimations';
import { StreakBadge } from './components';

/**
 * ShineSweep — a subtle white highlight that sweeps across the toast
 * after it enters, giving a premium "flash" feel.
 */
function ShineSweep({ visible }: { visible: boolean }) {
  const translateX = useSharedValue(-200);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Reset position
      translateX.value = -200;
      opacity.value = 0;

      // Sweep after toast has entered (delay 400ms)
      opacity.value = withDelay(400, withTiming(0.18, { duration: 100 }));
      translateX.value = withDelay(
        400,
        withTiming(400, {
          duration: 600,
          easing: Easing.out(Easing.cubic),
        }),
      );

      // Fade out at end
      opacity.value = withDelay(
        900,
        withTiming(0, { duration: 200 }),
      );
    }
  }, [visible, translateX, opacity]);

  const shineStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { skewX: '-20deg' },
    ],
  }));

  return (
    <Animated.View
      pointerEvents='none'
      style={[
        {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: 16,
          height: '100%',
          position: 'absolute',
          width: 60,
        },
        shineStyle,
      ]}
    />
  );
}

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
              overflow: 'hidden',
              ...theme.custom.shadows.card,
            },
            animatedStyle,
            style,
          ]}
        >
          <ShineSweep visible={visible} />
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
