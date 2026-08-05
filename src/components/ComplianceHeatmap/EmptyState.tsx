/**
 * Empty state view for ComplianceHeatmap
 * Standardized: animation (respects reduce-motion), icon, dark mode, accessible
 */

import React from 'react';
import { View } from 'react-native';
import { Grid3X3 } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../theme/ThemeContext';
import { useReducedMotionEntry } from '../EmptyState/useReducedMotionEntry';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights } from '@/theme/typography';

export function EmptyState() {
  const { colors, isDark } = useThemeColors();
  const { entry } = useReducedMotionEntry();

  return (
    <View
      accessible
      accessibilityLabel='No compliance data yet. Complete habits daily to see your compliance heatmap.'
      accessibilityRole='text'
      style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
    >
      <Animated.View
        entering={entry(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF',
          borderRadius: borderRadius.medium,
          height: 64,
          justifyContent: 'center',
          marginBottom: 16,
          shadowColor: '#3b82f6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 64,
        }}
      >
        <Grid3X3 color={isDark ? '#93C5FD' : '#3b82f6'} size={iconSizes.xl} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={entry(60)}
        style={{
          ...typography.heading2,
          color: colors.text.primary,
          fontWeight: fontWeights.bold,
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        No Compliance Data
      </Animated.Text>
      <Animated.Text
        entering={entry(120)}
        style={{
          ...typography.body,
          color: colors.text.secondary,
          lineHeight: 22,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        Complete habits daily to see your compliance heatmap
      </Animated.Text>
    </View>
  );
}
