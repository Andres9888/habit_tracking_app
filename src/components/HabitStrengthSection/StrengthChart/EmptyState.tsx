/**
 * StrengthChart EmptyState Component
 *
 * Shown when there isn't enough data to display the chart.
 * Migrated to theme tokens for dark mode support.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Activity } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';

import { CHART_HEIGHT } from '../constants';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

/**
 * Displays an encouraging message when chart has insufficient data.
 */
export const EmptyState = React.memo(function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel="Complete more days to see your strength chart"
      className="items-center justify-center"
      style={{ height: CHART_HEIGHT }}
    >
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? colors.gray[800] : colors.gray[50],
          borderRadius: 16,
          height: 48,
          justifyContent: 'center',
          marginBottom: 12,
          shadowColor: colors.primary[500],
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          width: 48,
        }}
      >
        <Activity color={colors.primary[500]} size={24} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontSize: 17,
          fontWeight: '600',
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        Building Strength
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 14,
          maxWidth: 260,
          textAlign: 'center',
        }}
      >
        Complete more days to see your strength chart
      </Animated.Text>
    </View>
  );
});
