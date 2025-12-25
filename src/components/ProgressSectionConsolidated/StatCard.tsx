/**
 * StatCard Component
 *
 * Individual stat card for the StatsGrid displaying a single metric
 * with icon, value, label, and optional trend indicator.
 *
 * Features:
 * - Color-coded backgrounds per stat type
 * - Staggered entrance animation
 * - Press animation for interactive cards
 * - Trend indicator badge
 * - Full accessibility support
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

import { Springs } from '../../constants/motion';
import type { StatCardProps } from './StatsGridTypes';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Stagger delay between card entrance animations (ms) */
const CARD_STAGGER_DELAY = 50;

/** Duration of card entrance animation (ms) */
const CARD_ENTRANCE_DURATION = 280;

/**
 * StatCard - Individual stat display card
 * Memoized to prevent unnecessary re-renders
 */
export const StatCard = React.memo(function StatCard({
  config,
  index,
  reduceMotion,
  isInteractive = false,
  onPress,
  onHapticFeedback,
}: StatCardProps) {
  // Entrance animation values
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const scale = useSharedValue(reduceMotion ? 1 : 0.9);

  // Press animation
  const pressScale = useSharedValue(1);

  // Run entrance animation
  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }

    const delay = index * CARD_STAGGER_DELAY;

    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: CARD_ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );

    scale.value = withDelay(delay, withSpring(1, Springs.gentle));
  }, [index, reduceMotion, opacity, scale]);

  // Press handlers
  const handlePressIn = () => {
    if (!isInteractive) return;
    pressScale.value = withSpring(0.95, Springs.button);
  };

  const handlePressOut = () => {
    if (!isInteractive) return;
    pressScale.value = withSpring(1, Springs.button);
  };

  const handlePress = () => {
    if (!isInteractive || !onPress) return;
    onHapticFeedback();
    onPress();
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * pressScale.value }],
  }));

  // Trend indicator component
  const renderTrendIndicator = () => {
    if (!config.showTrend || config.trend === undefined || config.trend === 0) {
      return null;
    }

    const isPositive = config.trend > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? '#16a34a' : '#dc2626'; // green-600 : red-600
    const bgColor = isPositive ? '#dcfce7' : '#fee2e2'; // green-100 : red-100
    const prefix = isPositive ? '+' : '';
    const label = config.id === 'monthly' ? '' : '%';

    return (
      <View
        accessibilityLabel={`${isPositive ? 'Up' : 'Down'} ${Math.abs(config.trend)}${label}`}
        className='ml-1 flex-row items-center rounded-full px-1.5 py-0.5'
        style={{ backgroundColor: bgColor }}
      >
        <Icon color={color} size={10} />
        <Text className='ml-0.5 text-[10px] font-medium' style={{ color }}>
          {prefix}
          {config.trend}
          {label}
        </Text>
      </View>
    );
  };

  const accessibilityLabel = `${config.label}: ${config.value}${
    config.showTrend && config.trend
      ? `, ${config.trend > 0 ? 'up' : 'down'} ${Math.abs(config.trend)}`
      : ''
  }`;

  const accessibilityHint = isInteractive
    ? 'Double tap to view details'
    : undefined;

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={isInteractive ? 'button' : 'text'}
      disabled={!isInteractive}
      style={containerStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        className='flex-1 rounded-xl px-3 py-2'
        style={{
          backgroundColor: config.backgroundColor,
          minHeight: 60,
        }}
      >
        {/* Icon and Value row */}
        <View className='flex-row items-center'>
          <Text className='text-base'>{config.icon}</Text>
          <Text className='ml-1.5 text-base font-bold text-stone-900'>
            {config.value}
          </Text>
          {renderTrendIndicator()}
        </View>

        {/* Label */}
        <Text className='mt-0.5 text-xs text-stone-500'>{config.label}</Text>
      </View>
    </AnimatedPressable>
  );
});

export default StatCard;
