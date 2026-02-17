/**
 * MicroHabitSuggestion - Smart suggestion to build micro-habits first
 *
 * Shows when user has no habits or low completion rate,
 * encouraging them to start with easy 2-5 minute habits.
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

interface MicroHabitSuggestionProps {
  /** Whether to show the suggestion */
  visible: boolean;
  /** Callback when user taps to create a micro-habit */
  onCreateMicroHabit: () => void;
  /** Callback to dismiss the suggestion */
  onDismiss: () => void;
}

export const MicroHabitSuggestion = memo(function MicroHabitSuggestion({
  visible,
  onCreateMicroHabit,
  onDismiss,
}: MicroHabitSuggestionProps) {
  const { colors: themeColors, isDark } = useThemeColors();

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(280).springify().damping(18)}
      style={{
        marginHorizontal: 24,
        marginTop: 16,
        backgroundColor: isDark ? '#1e3a29' : '#d1fae5',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#059669',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <Text style={{ fontSize: 24 }}>⚡</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: '#047857',
              marginBottom: 4,
            }}
          >
            Start with a micro-habit
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: '#065f46',
              lineHeight: 18,
              marginBottom: 12,
            }}
          >
            Build momentum with a 2-5 minute habit. Small wins lead to big
            changes!
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <TouchableOpacity
              onPress={onCreateMicroHabit}
              style={{
                backgroundColor: '#059669',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                Create micro-habit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDismiss}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: '#047857',
                  fontSize: 13,
                  fontWeight: '500',
                }}
              >
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});
