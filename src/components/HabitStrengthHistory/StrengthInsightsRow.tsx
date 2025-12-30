/**
 * StrengthInsightsRow Component
 *
 * Displays a horizontal row of three key metrics:
 * - Delta vs Month: Change in strength compared to 30 days ago
 * - Peak: Highest recorded strength value
 * - Lowest: Lowest recorded strength value
 *
 * Each metric is shown with an icon, value, and label.
 * The delta metric is color-coded (green/red) based on improvement/decline.
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  BarChart3,
} from 'lucide-react-native';

// Animation constants
const FADE_IN_DURATION = 400;
const ANIMATION_DELAY_BASE = 300;

export interface StrengthInsightsRowProps {
  /** Change in strength vs 30 days ago (positive = improvement) */
  deltaVsMonth: number;
  /** Highest recorded strength percentage (0-100) */
  peak: number;
  /** Lowest recorded strength percentage (0-100) */
  lowest: number;
}

interface InsightCardProps {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Primary value to display */
  value: string;
  /** Label text below the value */
  label: string;
  /** Color for the value text */
  valueColor?: string;
  /** Animation delay in ms */
  animationDelay?: number;
  /** Accessibility label for the card */
  accessibilityLabel: string;
}

/**
 * Individual insight card with icon, value, and label
 */
function InsightCard({
  icon,
  value,
  label,
  valueColor = '#44403c', // stone-700
  animationDelay = 0,
  accessibilityLabel,
}: InsightCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Animated.View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      className='flex-1 flex-row items-center gap-2 rounded-lg bg-stone-50 px-3 py-2.5'
      entering={
        shouldReduceMotion
          ? undefined
          : FadeIn.delay(animationDelay).duration(FADE_IN_DURATION)
      }
    >
      {/* Icon container */}
      <View className='items-center justify-center'>{icon}</View>

      {/* Text content */}
      <View className='flex-1'>
        <Text
          className='text-sm font-bold'
          numberOfLines={1}
          style={{ color: valueColor }}
        >
          {value}
        </Text>
        <Text className='text-xs text-stone-500' numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

/**
 * Get the appropriate icon for the delta value
 */
function getDeltaIcon(delta: number): React.ReactNode {
  const size = 18;

  if (delta > 0) {
    return <TrendingUp color='#10b981' size={size} testID='icon-trending-up' />;
  } else if (delta < 0) {
    return (
      <TrendingDown color='#ef4444' size={size} testID='icon-trending-down' />
    );
  }
  return <Minus color='#a8a29e' size={size} testID='icon-minus' />;
}

/**
 * Get the color for the delta value text
 */
function getDeltaColor(delta: number): string {
  if (delta > 0) return '#10b981'; // emerald-500
  if (delta < 0) return '#ef4444'; // red-500
  return '#a8a29e'; // stone-400
}

/**
 * Format the delta value with sign and percentage
 */
function formatDelta(delta: number): string {
  if (delta > 0) {
    return `+${delta.toFixed(0)}%`;
  } else if (delta < 0) {
    return `${delta.toFixed(0)}%`;
  }
  return '0%';
}

/**
 * StrengthInsightsRow - Three-column metrics layout
 */
export function StrengthInsightsRow({
  deltaVsMonth,
  peak,
  lowest,
}: StrengthInsightsRowProps) {
  return (
    <View
      accessible
      accessibilityLabel='Habit strength insights and statistics'
      accessibilityRole='none'
      className='flex-row gap-2'
    >
      {/* Delta vs Month Card */}
      <InsightCard
        accessibilityLabel={`${deltaVsMonth >= 0 ? 'Improved' : 'Declined'} ${Math.abs(deltaVsMonth).toFixed(0)} percent compared to last month`}
        animationDelay={ANIMATION_DELAY_BASE}
        icon={getDeltaIcon(deltaVsMonth)}
        label='vs Month'
        value={formatDelta(deltaVsMonth)}
        valueColor={getDeltaColor(deltaVsMonth)}
      />

      {/* Peak Card */}
      <InsightCard
        accessibilityLabel={`Peak strength: ${Math.round(peak)} percent`}
        animationDelay={ANIMATION_DELAY_BASE + 100}
        icon={<Trophy color='#f59e0b' size={18} testID='icon-trophy' />}
        label='Peak'
        value={`${Math.round(peak)}%`}
      />

      {/* Lowest Card */}
      <InsightCard
        accessibilityLabel={`Lowest strength: ${Math.round(lowest)} percent`}
        animationDelay={ANIMATION_DELAY_BASE + 200}
        icon={<BarChart3 color='#6b7280' size={18} testID='icon-chart' />}
        label='Lowest'
        value={`${Math.round(lowest)}%`}
      />
    </View>
  );
}

export default StrengthInsightsRow;
