/**
 * StatCard Component
 *
 * Individual stat card for the StatsGrid displaying a single metric
 * with icon, value, label, and optional trend indicator.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import type { StatCardProps } from './StatsGridTypes';
import { useStatCardAnimation } from './useStatCardAnimation';
import { StatCardTrendBadge } from './StatCardTrendBadge';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const StatCard = React.memo(function StatCard({
  config,
  index,
  reduceMotion,
  isInteractive = false,
  onPress,
  onHapticFeedback,
}: StatCardProps) {
  const { colors, isDark } = useThemeColors();
  const { containerStyle, handlePressIn, handlePressOut } =
    useStatCardAnimation({
      index,
      isInteractive,
      reduceMotion,
    });

  const handlePress = () => {
    if (!isInteractive || !onPress) return;
    onHapticFeedback();
    onPress();
  };

  const accessibilityLabel = `${config.label}: ${config.value}${
    config.subLabel ? `, ${config.subLabel}` : ''
  }${
    config.showTrend && config.trend
      ? `, ${config.trend > 0 ? 'up' : 'down'} ${Math.abs(config.trend)}`
      : ''
  }`;

  // Get theme-aware background colors
  const getBackgroundColor = () => {
    if (!isDark) return config.backgroundColor;
    
    // Dark mode variants - slightly lighter than card background
    const darkModeColors: Record<string, string> = {
      'streak': '#3f2316', // orange-900 darker
      'monthly': '#2d1f47', // violet-900 darker  
      'bestDay': '#052e20', // emerald-900 darker
      'focusDay': '#3d2a0d', // amber-900 darker
    };
    return darkModeColors[config.id] || colors.surface;
  };

  return (
    <AnimatedPressable
      accessibilityHint={
        isInteractive ? 'Double tap to view details' : undefined
      }
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
        style={{ backgroundColor: getBackgroundColor(), minHeight: 60 }}
      >
        <View className='flex-row items-center'>
          <Text className='text-base'>{config.icon}</Text>
          <Text 
            className='ml-1.5 text-base font-bold'
            style={{ color: colors.text.primary }}
          >
            {config.value}
          </Text>
          <StatCardTrendBadge
            showTrend={config.showTrend}
            statId={config.id}
            trend={config.trend}
          />
        </View>
        <Text 
          className='mt-0.5 text-xs'
          style={{ color: colors.text.secondary }}
        >
          {config.label}
        </Text>
        {config.subLabel && (
          <Text 
            className='mt-0.5 text-xs'
            style={{ color: colors.text.tertiary }}
          >
            {config.subLabel}
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
});

export default StatCard;
