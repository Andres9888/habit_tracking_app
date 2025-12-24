/**
 * StreakRecordsAccordion Component
 *
 * Collapsible section showing streak medal records.
 * Collapsed by default to reduce cognitive load.
 *
 * Features:
 * - Collapsed by default with medal preview (🥇6 🥈6 🥉2)
 * - Expand/collapse animation (height + opacity)
 * - Medal display when expanded (same as PersonalBestsCard medals)
 * - Current streak highlighted with pulse animation + "NOW 🔥" badge
 * - Accessibility announcements for state changes
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

import type { StreakRecordsAccordionProps } from './types';

/** Animation duration for expand/collapse (ms) */
const ANIMATION_DURATION = 250;

/** Medal configurations */
const MEDALS = ['🥇', '🥈', '🥉'] as const;
const MEDAL_COLORS = [
  {
    bg: '#fffbeb', // amber-50
    border: '#fde68a',
    // amber-700
    subtext: '#f59e0b',
    // amber-200
    text: '#b45309', // amber-500
  },
  {
    bg: '#fafaf9', // stone-50
    border: '#e7e5e4',
    // stone-700
    subtext: '#78716c',
    // stone-200
    text: '#44403c', // stone-500
  },
  {
    bg: '#fff7ed', // orange-50
    border: '#fed7aa',
    // orange-700
    subtext: '#f97316',
    // orange-200
    text: '#c2410c', // orange-500
  },
] as const;

/**
 * Format date for display (e.g., "Dec 1")
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
}

/**
 * StreakRecordsAccordion Component
 *
 * Displays a collapsible section with streak medal records.
 */
export function StreakRecordsAccordion({
  streakRecords,
  currentStreak,
  defaultExpanded = false,
}: StreakRecordsAccordionProps) {
  const reduceMotion = useReduceMotion();
  const { triggerSelection } = useHapticFeedback();

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);

  // Animation values
  const expandProgress = useSharedValue(defaultExpanded ? 1 : 0);
  const chevronRotation = useSharedValue(defaultExpanded ? 180 : 0);

  // Pulse animation for current streak
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  // Start pulse animation for current streak
  useEffect(() => {
    if (reduceMotion || currentStreak === 0) return;

    // 2000ms infinite pulse
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [currentStreak, reduceMotion, pulseScale, pulseOpacity]);

  // Handle content height measurement
  const handleContentLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setContentHeight(height);
      setHasContentMeasured(true);
    }
  }, []);

  // Toggle expand/collapse
  const handleToggle = useCallback(() => {
    triggerSelection();
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    const duration = reduceMotion ? 0 : ANIMATION_DURATION;
    const targetValue = newExpanded ? 1 : 0;
    const chevronTarget = newExpanded ? 180 : 0;

    expandProgress.value = withTiming(targetValue, {
      duration,
      easing: Easing.out(Easing.ease),
    });

    chevronRotation.value = withTiming(chevronTarget, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [
    isExpanded,
    reduceMotion,
    triggerSelection,
    expandProgress,
    chevronRotation,
  ]);

  // Animated styles for content container
  const contentAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      expandProgress.value,
      [0, 1],
      [0, contentHeight]
    );
    const opacity = expandProgress.value;

    return {
      height: hasContentMeasured ? height : 'auto',
      opacity,
      overflow: 'hidden',
    };
  });

  // Animated style for chevron rotation
  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  // Animated style for pulse effect on current streak
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  // Get top 3 records
  const top3Records = streakRecords.slice(0, 3);
  const hasRecords = top3Records.length > 0;

  // Generate preview text (e.g., "🥇6 🥈6 🥉2")
  const previewText = top3Records
    .map((record, i) => `${MEDALS[i]}${record.days}`)
    .join(' ');

  // Generate accessibility label
  const accessibilityLabel = hasRecords
    ? `Streak records. ${top3Records.map((record, i) => `${i === 0 ? 'Gold' : i === 1 ? 'Silver' : 'Bronze'}: ${record.days} days${record.isCurrent ? ', current streak' : ''}`).join(', ')}. ${isExpanded ? 'Expanded' : 'Collapsed'}. Double tap to ${isExpanded ? 'collapse' : 'expand'}.`
    : 'No streak records yet. Complete 2+ consecutive days to start tracking streaks.';

  // Empty state
  if (!hasRecords && currentStreak === 0) {
    return (
      <View
        accessibilityLabel='No streak records yet. Complete 2+ consecutive days to start tracking streaks.'
        className='mt-3 items-center rounded-xl border border-stone-200 bg-white p-4'
      >
        <Text className='text-sm text-stone-400'>
          Complete 2+ consecutive days to start tracking streaks
        </Text>
      </View>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className='mt-3 overflow-hidden rounded-xl border border-stone-200 bg-white'
    >
      {/* Header (always visible) */}
      <Pressable
        accessibilityHint={`Double tap to ${isExpanded ? 'collapse' : 'expand'} streak records`}
        accessibilityRole='button'
        accessibilityState={{ expanded: isExpanded }}
        className='flex-row items-center justify-between p-3'
        onPress={handleToggle}
      >
        <View className='flex-row items-center gap-2'>
          <Text className='text-sm font-medium text-stone-700'>
            Streak Records
          </Text>
          {/* Preview medals when collapsed */}
          {!isExpanded && hasRecords && (
            <Text className='text-xs text-stone-500'>{previewText}</Text>
          )}
        </View>
        <Animated.View style={chevronAnimatedStyle}>
          <Ionicons color='#78716c' name='chevron-down' size={18} />
        </Animated.View>
      </Pressable>

      {/* Expandable Content */}
      <Animated.View style={contentAnimatedStyle}>
        <View className='px-3 pb-3' onLayout={handleContentLayout}>
          {/* Medal cards */}
          <View className='flex-row gap-2'>
            {top3Records.map((record, i) => {
              const colors = MEDAL_COLORS[i];
              const isCurrentRecord =
                record.isCurrent ||
                (currentStreak > 0 && record.days === currentStreak);

              return (
                <Animated.View
                  key={`${record.startDate}-${record.days}`}
                  accessibilityLabel={`${i === 0 ? 'First' : i === 1 ? 'Second' : 'Third'} best streak: ${record.days} days, from ${formatDate(record.startDate)} to ${formatDate(record.endDate)}${isCurrentRecord ? ', current streak' : ''}`}
                  className='flex-1 items-center rounded-xl border p-2.5'
                  style={[
                    {
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                    },
                    isCurrentRecord && !reduceMotion
                      ? pulseAnimatedStyle
                      : undefined,
                  ]}
                >
                  <Text className='mb-0.5 text-base'>{MEDALS[i]}</Text>
                  <Text
                    className='text-lg font-bold'
                    style={{ color: colors.text }}
                  >
                    {record.days}
                  </Text>
                  <Text
                    className='text-[9px]'
                    style={{ color: colors.subtext }}
                  >
                    days
                  </Text>
                  {isCurrentRecord && (
                    <View
                      className='mt-1 rounded-full px-1.5 py-0.5'
                      style={{ backgroundColor: '#ffedd5' }} // orange-100
                    >
                      <Text
                        className='text-[8px] font-semibold'
                        style={{ color: '#c2410c' }} // orange-700
                      >
                        NOW 🔥
                      </Text>
                    </View>
                  )}
                  <Text
                    className='mt-1 text-center text-[8px]'
                    style={{ color: colors.subtext }}
                  >
                    {formatDate(record.startDate)} -{' '}
                    {formatDate(record.endDate)}
                  </Text>
                </Animated.View>
              );
            })}

            {/* Fill empty slots if less than 3 records */}
            {top3Records.length < 3 &&
              Array.from({ length: 3 - top3Records.length }).map((_, i) => (
                <View
                  key={`empty-${i}`}
                  accessibilityLabel={`${top3Records.length + i === 1 ? 'Silver' : 'Bronze'} medal: not yet earned`}
                  className='flex-1 items-center rounded-xl border border-stone-100 p-2.5'
                  style={{ backgroundColor: '#fafaf9' }} // stone-50
                >
                  <Text className='mb-0.5 text-base opacity-30'>
                    {MEDALS[top3Records.length + i]}
                  </Text>
                  <Text
                    className='text-lg font-bold'
                    style={{ color: '#d6d3d1' }} // stone-300
                  >
                    -
                  </Text>
                  <Text
                    className='text-[9px]'
                    style={{ color: '#d6d3d1' }} // stone-300
                  >
                    days
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </Animated.View>

      {/* Hidden content for measuring height */}
      {!hasContentMeasured && (
        <View
          className='absolute opacity-0'
          pointerEvents='none'
          onLayout={handleContentLayout}
        >
          <View className='px-3 pb-3'>
            <View className='flex-row gap-2'>
              {top3Records.map((record, i) => {
                const colors = MEDAL_COLORS[i];
                const isCurrentRecord =
                  record.isCurrent ||
                  (currentStreak > 0 && record.days === currentStreak);

                return (
                  <View
                    key={`measure-${record.startDate}-${record.days}`}
                    className='flex-1 items-center rounded-xl border p-2.5'
                    style={{
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                    }}
                  >
                    <Text className='mb-0.5 text-base'>{MEDALS[i]}</Text>
                    <Text
                      className='text-lg font-bold'
                      style={{ color: colors.text }}
                    >
                      {record.days}
                    </Text>
                    <Text
                      className='text-[9px]'
                      style={{ color: colors.subtext }}
                    >
                      days
                    </Text>
                    {isCurrentRecord && (
                      <View
                        className='mt-1 rounded-full px-1.5 py-0.5'
                        style={{ backgroundColor: '#ffedd5' }}
                      >
                        <Text
                          className='text-[8px] font-semibold'
                          style={{ color: '#c2410c' }}
                        >
                          NOW 🔥
                        </Text>
                      </View>
                    )}
                    <Text
                      className='mt-1 text-center text-[8px]'
                      style={{ color: colors.subtext }}
                    >
                      {formatDate(record.startDate)} -{' '}
                      {formatDate(record.endDate)}
                    </Text>
                  </View>
                );
              })}
              {top3Records.length < 3 &&
                Array.from({ length: 3 - top3Records.length }).map((_, i) => (
                  <View
                    key={`measure-empty-${i}`}
                    className='flex-1 items-center rounded-xl border border-stone-100 p-2.5'
                    style={{ backgroundColor: '#fafaf9' }}
                  >
                    <Text className='mb-0.5 text-base opacity-30'>
                      {MEDALS[top3Records.length + i]}
                    </Text>
                    <Text
                      className='text-lg font-bold'
                      style={{ color: '#d6d3d1' }}
                    >
                      -
                    </Text>
                    <Text className='text-[9px]' style={{ color: '#d6d3d1' }}>
                      days
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default StreakRecordsAccordion;
