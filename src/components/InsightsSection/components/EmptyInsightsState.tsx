/**
 * EmptyInsightsState Component
 * Shown when not enough tracking data exists for insights
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BarChart3, Calendar } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { EmptyInsightsStateProps } from '../InsightsSection.types';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { borderRadius, spacing } from '@/theme/spacing';
import { iconSizes } from '@/theme/iconSizes';
import { durations, enterEasing } from '@/theme/animations';

export function EmptyInsightsState({ daysRemaining }: EmptyInsightsStateProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(durations.enter).easing(enterEasing)}
      style={{
        backgroundColor: colors.card,
        borderRadius: borderRadius.card,
        overflow: 'hidden',
        shadowColor: colors.text.primary,
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      }}
    >
      <View style={{ padding: spacing.lg }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              backgroundColor: isDark ? '#2E1065' : '#F5F3FF',
              borderRadius: 8,
              height: 32,
              justifyContent: 'center',
              width: 32,
            }}
          >
            <BarChart3 color={isDark ? '#C4B5FD' : '#A78BFA'} size={iconSizes.small} />
          </View>
          <Text style={{ color: colors.text.secondary, fontFamily: fontFamilies.primary.text, fontSize: 17, fontWeight: fontWeights.bold }}>
            Insights
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.gray[50],
            borderRadius: borderRadius.medium,
            paddingVertical: 24,
          }}
        >
          <Calendar color={colors.text.tertiary} size={iconSizes.xl} style={{ marginBottom: 8 }} />
          <Text style={{ color: colors.text.secondary, fontFamily: fontFamilies.primary.text, fontSize: 14, textAlign: 'center' }}>
            Keep tracking for insights
          </Text>
          <Text
            style={{
              color: colors.text.tertiary,
              fontFamily: fontFamilies.primary.text,
              fontSize: 13,
              marginTop: 4,
              textAlign: 'center',
            }}
          >
            {daysRemaining} more days needed
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
