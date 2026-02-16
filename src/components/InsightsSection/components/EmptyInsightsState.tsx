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

export function EmptyInsightsState({ daysRemaining }: EmptyInsightsStateProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify().damping(18)}
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: colors.text.primary,
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      }}
    >
      <View style={{ padding: 20 }}>
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
              backgroundColor: colors.purple[50],
              borderRadius: 8,
              height: 32,
              justifyContent: 'center',
              width: 32,
            }}
          >
            <BarChart3 color={colors.purple.text} size={16} />
          </View>
          <Text style={{ color: colors.text.secondary, fontSize: 17, fontWeight: '700' }}>
            Insights
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.gray[50],
            borderRadius: 12,
            paddingVertical: 24,
          }}
        >
          <Calendar color={colors.text.tertiary} size={28} style={{ marginBottom: 8 }} />
          <Text style={{ color: colors.text.secondary, fontSize: 14, textAlign: 'center' }}>
            Keep tracking for insights
          </Text>
          <Text
            style={{
              color: colors.text.tertiary,
              fontSize: 12,
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
