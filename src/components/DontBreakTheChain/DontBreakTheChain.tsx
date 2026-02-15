/**
 * DontBreakTheChain Component
 *
 * A gentle, encouraging nudge shown when the user has a strong streak
 * going but hasn't completed their habits for today yet.
 *
 * Design: subtle card with streak count, motivational copy, and chain emoji.
 * Follows the app's design system: 16px border radius, SF Pro/Roboto,
 * spring animations with damping(18).
 */

import React from 'react';
import { View, Text, Animated } from 'react-native';
import type { DontBreakTheChainProps } from './types';
import { getNudgeMessage } from './messages';

const MIN_STREAK_DEFAULT = 3;

export function DontBreakTheChain({
  currentStreak,
  habitName,
  minStreak = MIN_STREAK_DEFAULT,
  reduceMotion = false,
  completedToday = false,
}: DontBreakTheChainProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const shouldShow = currentStreak >= minStreak && !completedToday;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: shouldShow ? 1 : 0,
      duration: reduceMotion ? 0 : 280,
      useNativeDriver: true,
    }).start();
  }, [shouldShow, fadeAnim, reduceMotion]);

  if (!shouldShow) return null;

  const nudge = getNudgeMessage(currentStreak);

  return (
    <Animated.View
      accessibilityLabel={`${currentStreak}-day streak. ${nudge.title}`}
      accessibilityRole="text"
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            }),
          },
        ],
      }}
    >
      <View
        style={{
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0',
          borderRadius: 16,
          borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 28 }}>{nudge.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: '#047857',
              fontSize: 15,
              fontWeight: '600',
              marginBottom: 2,
            }}
          >
            {nudge.title}
          </Text>
          <Text
            style={{
              color: '#065f46',
              fontSize: 13,
              lineHeight: 18,
              opacity: 0.85,
            }}
          >
            {nudge.subtitle}
          </Text>
          {habitName ? (
            <Text
              style={{
                color: '#059669',
                fontSize: 12,
                fontWeight: '500',
                marginTop: 4,
              }}
            >
              🔗 {currentStreak} days · {habitName}
            </Text>
          ) : (
            <Text
              style={{
                color: '#059669',
                fontSize: 12,
                fontWeight: '500',
                marginTop: 4,
              }}
            >
              🔗 {currentStreak}-day streak
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
