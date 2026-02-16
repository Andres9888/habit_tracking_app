/**
 * DayCircle Component
 * Individual day indicator in the 7-day streak chain — theme-aware
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../theme/ThemeContext';
import { colors as palette } from '../../theme/colors';
import type { DayCircleProps } from './types';

export function DayCircle({
  completed,
  index,
  isToday,
  label,
  todayCompleted,
}: DayCircleProps) {
  const { colors, isDark } = useThemeColors();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    const delay = index * 35;
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 120 }));

    if (isToday && !todayCompleted) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      cancelAnimation(pulse);
    };
  }, [index, isToday, todayCompleted, scale, opacity, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        scale:
          isToday && !todayCompleted ? scale.value * pulse.value : scale.value,
      },
    ],
  }));

  // Circle colors
  const circleBg = completed
    ? palette.primary[500]
    : isToday
      ? isDark ? 'rgba(217, 119, 6, 0.15)' : palette.streak[100]
      : isDark ? colors.gray[200] : colors.gray[50];

  const circleBorder = isToday && !completed
    ? palette.streak[500]
    : undefined;

  // Label colors
  const labelColor = isToday
    ? palette.streak[600]
    : completed
      ? palette.primary[600]
      : colors.text.tertiary;

  const a11yLabel = isToday
    ? `${label}, today${todayCompleted ? ', completed' : ', not yet completed'}`
    : `${label}${completed ? ', completed' : ', not completed'}`;

  return (
    <Animated.View style={[localStyles.wrapper, animatedStyle]}>
      <View
        style={[
          localStyles.circle,
          { backgroundColor: circleBg },
          circleBorder ? { borderColor: circleBorder, borderWidth: 2 } : undefined,
        ]}
      >
        {completed ? (
          <Ionicons color="#FFFFFF" name="checkmark" size={20} />
        ) : isToday ? (
          <Ionicons color={palette.streak[500]} name="flash" size={18} />
        ) : null}
      </View>
      <Text style={[localStyles.label, { color: labelColor }]}>{label}</Text>
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginBottom: 6,
    width: 40,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  wrapper: {
    alignItems: 'center',
    flex: 1,
  },
});
