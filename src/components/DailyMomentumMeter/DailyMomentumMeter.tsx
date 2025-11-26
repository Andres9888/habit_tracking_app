/**
 * DailyMomentumMeter Component
 *
 * A beautiful animated progress indicator showing today's habit completion percentage.
 * Features:
 * - Animated fill based on completion
 * - Celebratory state at 100%
 * - Motivational messaging based on progress
 * - Premium visual design (no SVG dependencies)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Zap, Target, Trophy, Sparkles, Flame } from 'lucide-react-native';

interface DailyMomentumMeterProps {
  /** Number of habits completed today */
  completedToday: number;
  /** Total number of habits */
  totalHabits: number;
  /** Whether to reduce motion */
  reduceMotion?: boolean;
  /** Size of the progress indicator */
  size?: 'compact' | 'standard';
}

export function DailyMomentumMeter({
  completedToday,
  totalHabits,
  reduceMotion = false,
  size = 'standard',
}: DailyMomentumMeterProps) {
  const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const flameScale = useRef(new Animated.Value(1)).current;

  const isCompact = size === 'compact';

  // Animate progress on change
  useEffect(() => {
    if (reduceMotion) {
      progressAnim.setValue(percentage);
      return;
    }

    Animated.spring(progressAnim, {
      toValue: percentage,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [percentage, reduceMotion, progressAnim]);

  // Celebration animation at 100%
  useEffect(() => {
    if (percentage === 100 && !reduceMotion) {
      // Pulse celebration
      Animated.loop(
        Animated.sequence([
          Animated.timing(celebrationScale, {
            toValue: 1.03,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(celebrationScale, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.5,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Flame bounce
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameScale, {
            toValue: 1.15,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(flameScale, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      celebrationScale.setValue(1);
      glowOpacity.setValue(0);
      flameScale.setValue(1);
    }
  }, [percentage, reduceMotion, celebrationScale, glowOpacity, flameScale]);

  // Get colors based on progress
  const getProgressColors = () => {
    if (percentage === 100) return { bg: '#dcfce7', fill: '#10b981', text: '#047857', glow: '#10b981' }; // Emerald
    if (percentage >= 80) return { bg: '#dcfce7', fill: '#22c55e', text: '#15803d', glow: '#22c55e' }; // Green
    if (percentage >= 60) return { bg: '#fef9c3', fill: '#eab308', text: '#a16207', glow: '#eab308' }; // Yellow
    if (percentage >= 40) return { bg: '#ffedd5', fill: '#f97316', text: '#c2410c', glow: '#f97316' }; // Orange
    return { bg: '#fee2e2', fill: '#ef4444', text: '#b91c1c', glow: '#ef4444' }; // Red
  };

  const colors = getProgressColors();

  // Get motivational message
  const getMessage = () => {
    if (percentage === 100) return { text: 'Perfect Day!', icon: Trophy, emoji: '🏆' };
    if (percentage >= 80) return { text: 'Almost there!', icon: Sparkles, emoji: '✨' };
    if (percentage >= 60) return { text: 'Great progress', icon: Zap, emoji: '⚡' };
    if (percentage >= 40) return { text: 'Keep going', icon: Target, emoji: '🎯' };
    if (percentage > 0) return { text: 'Getting started', icon: Flame, emoji: '🔥' };
    return { text: 'Start your day', icon: Target, emoji: '🌅' };
  };

  const message = getMessage();

  // Progress bar width calculation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (isCompact) {
    // Compact horizontal bar design
    return (
      <View className='flex-row items-center gap-2'>
        <View
          className='h-2 flex-1 overflow-hidden rounded-full'
          style={{ backgroundColor: '#e7e5e4' }} // stone-200
        >
          <Animated.View
            className='h-full rounded-full'
            style={{
              backgroundColor: colors.fill,
              width: progressWidth,
            }}
          />
        </View>
        <Text
          className='text-[12px] font-bold tabular-nums'
          style={{ color: colors.text, minWidth: 32, textAlign: 'right' }}
        >
          {percentage}%
        </Text>
      </View>
    );
  }

  // Standard card design
  return (
    <Animated.View
      className='flex-row items-center gap-4 rounded-2xl px-4 py-3'
      style={{
        backgroundColor: colors.bg,
        transform: [{ scale: celebrationScale }],
        // Glow effect for 100%
        shadowColor: percentage === 100 ? colors.glow : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: percentage === 100 ? 0.4 : 0,
        shadowRadius: 12,
        elevation: percentage === 100 ? 4 : 0,
      }}
    >
      {/* Progress ring (simulated with nested views) */}
      <View className='relative'>
        {/* Background ring */}
        <View
          className='h-14 w-14 items-center justify-center rounded-full border-4'
          style={{
            borderColor: '#ffffff',
            backgroundColor: 'transparent',
          }}
        >
          {/* Inner fill */}
          <View
            className='h-10 w-10 items-center justify-center rounded-full'
            style={{
              backgroundColor: percentage > 0 ? colors.fill : '#e7e5e4',
            }}
          >
            <Animated.Text
              className='text-lg'
              style={{
                transform: [{ scale: flameScale }],
              }}
            >
              {message.emoji}
            </Animated.Text>
          </View>
        </View>

        {/* Percentage badge */}
        <View
          className='absolute -bottom-1 -right-1 items-center justify-center rounded-full px-1.5 py-0.5'
          style={{
            backgroundColor: colors.fill,
            minWidth: 28,
          }}
        >
          <Text className='text-[10px] font-extrabold text-white'>
            {percentage}%
          </Text>
        </View>
      </View>

      {/* Text content */}
      <View className='flex-1'>
        <Text
          className='text-[15px] font-bold'
          style={{ color: colors.text }}
        >
          {message.text}
        </Text>
        <Text className='mt-0.5 text-[13px] font-medium text-stone-500'>
          {completedToday} of {totalHabits} habits done
        </Text>

        {/* Progress bar */}
        <View className='mt-2'>
          <View
            className='h-1.5 overflow-hidden rounded-full'
            style={{ backgroundColor: '#ffffff' }}
          >
            <Animated.View
              className='h-full rounded-full'
              style={{
                backgroundColor: colors.fill,
                width: progressWidth,
              }}
            />
          </View>
        </View>
      </View>

      {/* Celebration sparkles for 100% */}
      {percentage === 100 && (
        <Animated.View
          style={{
            opacity: glowOpacity,
          }}
        >
          <Text className='text-2xl'>🎉</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default DailyMomentumMeter;
