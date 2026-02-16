/**
 * Empty state view for ComplianceHeatmap
 * ENHANCED: More encouraging, visual progress motivation
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { useReducedMotionEntry } from '../EmptyState/useReducedMotionEntry';

export function EmptyState() {
  const { colors, isDark } = useThemeColors();
  const { entry } = useReducedMotionEntry();

  return (
    <View
      accessible
      accessibilityLabel='Start building your heatmap! Complete habits daily to watch your consistency grow.'
      accessibilityRole='text'
      style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
    >
      {/* Icon */}
      <Animated.View
        entering={entry(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#431407' : '#FFF7ED',
          borderRadius: 16,
          height: 80,
          justifyContent: 'center',
          marginBottom: 20,
          shadowColor: '#f59e0b',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 80,
        }}
      >
        <Flame color={isDark ? '#FDBA74' : '#F97316'} size={40} strokeWidth={1.5} />
      </Animated.View>

      {/* Headline */}
      <Animated.Text
        entering={entry(60)}
        style={{
          color: colors.text.primary,
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        Build Your Heatmap!
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={entry(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
          marginBottom: 24,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        Complete habits daily to watch your consistency grow
      </Animated.Text>

      {/* Visual Preview Card */}
      <Animated.View
        entering={entry(180)}
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: 12,
          borderWidth: 1,
          padding: 16,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 2, width: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          width: '100%',
        }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Text style={{ fontSize: 20 }}>🎨</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 4,
              }}
            >
              Coming Soon
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              Your heatmap will fill with color as you complete habits. Watch patterns emerge and celebrate your consistency!
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
