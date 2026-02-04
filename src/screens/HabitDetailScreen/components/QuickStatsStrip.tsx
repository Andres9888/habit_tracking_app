/**
 * QuickStatsStrip Component
 * 3-column stats strip: Total, Success Rate, Strength
 * 
 * @see HABIT-DETAIL-AFTER-SPEC.md for design details
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface QuickStatsStripProps {
  totalCompletions: number;
  successRate: number;
  strength: number;
  reduceMotion?: boolean;
}

export function QuickStatsStrip({
  totalCompletions,
  successRate,
  strength,
  reduceMotion = false,
}: QuickStatsStripProps) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 6);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    opacity.value = withDelay(160, withTiming(1, { duration: 240, easing: Easing.out(Easing.ease) }));
    translateY.value = withDelay(160, withTiming(0, { duration: 240, easing: Easing.out(Easing.ease) }));
  }, [reduceMotion, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const strengthPercent = Math.round(strength * 100);

  return (
    <Animated.View
      style={[{
        height: 72,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e7e5e4',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
      }, animatedStyle]}
    >
      {/* Total Completions */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1F2937', letterSpacing: -0.24, lineHeight: 29 }}>
          {totalCompletions}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#78716c', letterSpacing: 0.12, textTransform: 'uppercase', marginTop: 2 }}>
          Total
        </Text>
      </View>

      {/* Divider */}
      <View style={{ width: 1, height: 36, backgroundColor: '#e7e5e4' }} />

      {/* Success Rate */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1F2937', letterSpacing: -0.24, lineHeight: 29 }}>
          {Math.round(successRate)}%
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#78716c', letterSpacing: 0.12, textTransform: 'uppercase', marginTop: 2 }}>
          Success
        </Text>
      </View>

      {/* Divider */}
      <View style={{ width: 1, height: 36, backgroundColor: '#e7e5e4' }} />

      {/* Strength with mini bar */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        {/* Mini progress bar */}
        <View style={{ width: 32, height: 4, borderRadius: 2, backgroundColor: '#e7e5e4', marginBottom: 4, overflow: 'hidden' }}>
          <View style={{ width: (strengthPercent / 100) * 32, height: 4, borderRadius: 2, backgroundColor: '#10B981' }} />
        </View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1F2937', letterSpacing: -0.24, lineHeight: 29 }}>
          {strengthPercent}%
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#78716c', letterSpacing: 0.12, textTransform: 'uppercase', marginTop: 2 }}>
          Strength
        </Text>
      </View>
    </Animated.View>
  );
}
