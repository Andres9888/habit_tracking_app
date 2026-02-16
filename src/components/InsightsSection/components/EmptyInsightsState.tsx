/**
 * EmptyInsightsState Component
 * ENHANCED: More encouraging, progress-focused messaging
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Lightbulb } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { EmptyInsightsStateProps } from '../InsightsSection.types';

export function EmptyInsightsState({ daysRemaining }: EmptyInsightsStateProps) {
  const { colors, isDark } = useThemeColors();

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
        {/* Header */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              backgroundColor: isDark ? '#451A03' : '#FFFBEB',
              borderRadius: 8,
              height: 32,
              justifyContent: 'center',
              width: 32,
            }}
          >
            <Lightbulb color={isDark ? '#FCD34D' : '#F59E0B'} size={16} />
          </View>
          <Text style={{ color: colors.text.secondary, fontSize: 17, fontWeight: '700' }}>
            Insights
          </Text>
        </View>

        {/* Content */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
            borderRadius: 12,
            paddingVertical: 24,
          }}
        >
          <Text style={{ fontSize: 32, marginBottom: 8 }}>📊</Text>
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 15,
              fontWeight: '600',
              marginBottom: 4,
              textAlign: 'center',
            }}
          >
            Insights Coming Soon!
          </Text>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 13,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            Keep up the great work
          </Text>

          {/* Progress indicator */}
          <View
            style={{
              backgroundColor: isDark ? '#047857' : '#D1FAE5',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                color: isDark ? '#D1FAE5' : '#047857',
                fontSize: 12,
                fontWeight: '500',
              }}
            >
              {daysRemaining === 1
                ? '🎯 Just 1 more day!'
                : `🎯 ${daysRemaining} more days to unlock`}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
