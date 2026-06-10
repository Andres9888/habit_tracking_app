/**
 * FormedHabitsSection — collapsible "trophy shelf" rendered below the active
 * habits list. Shows habits the user has marked as formed via the
 * right-swipe gesture. Hidden entirely when there are none.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown, Trophy } from 'lucide-react-native';
import { colors as themeColors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { borderRadius } from '../../../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { FormedHabitCard } from './FormedHabitCard';
import { useFormedHabitsSection } from './FormedHabitsSection.hooks';

export function FormedHabitsSection() {
  const { colors } = useThemeColors();
  const {
    chevronAnimatedStyle,
    contentAnimatedStyle,
    formedHabits,
    handleContentLayout,
    handleResume,
    handleToggle,
    isExpanded,
  } = useFormedHabitsSection();

  if (formedHabits.length === 0) return null;

  return (
    <View style={{ marginTop: 8 }}>
      <Pressable
        accessibilityLabel={`Formed habits, ${formedHabits.length}. ${isExpanded ? 'Expanded' : 'Collapsed'}. Tap to toggle.`}
        accessibilityRole='button'
        style={({ pressed }) => ({
          alignItems: 'center',
          flexDirection: 'row',
          gap: 8,
          opacity: pressed ? 0.7 : 1,
          paddingHorizontal: 4,
          paddingVertical: 10,
        })}
        onPress={handleToggle}
      >
        <Trophy
          color={themeColors.streak[300]}
          size={iconSizes.small}
          strokeWidth={2}
        />
        <Text
          style={{
            color: colors.text.primary,
            flex: 1,
            fontFamily: fontFamilies.primary.text,
            fontSize: typography.bodySmall.fontSize,
            fontWeight: fontWeights.bold,
            letterSpacing: 0.3,
          }}
        >
          Formed habits
        </Text>
        <View
          style={{
            backgroundColor: themeColors.streak[300],
            borderRadius: borderRadius.full,
            paddingHorizontal: 8,
            paddingVertical: 1,
          }}
        >
          <Text
            style={{
              color: themeColors.streak[700],
              fontFamily: fontFamilies.primary.text,
              fontSize: typography.caption.fontSize,
              fontWeight: fontWeights.bold,
            }}
          >
            {formedHabits.length}
          </Text>
        </View>
        <Animated.View style={chevronAnimatedStyle}>
          <ChevronDown
            color={colors.text.secondary}
            size={iconSizes.small}
            strokeWidth={2}
          />
        </Animated.View>
      </Pressable>

      <Animated.View style={contentAnimatedStyle}>
        <View onLayout={handleContentLayout}>
          {formedHabits.map((habit) => (
            <FormedHabitCard
              habit={habit}
              key={habit._id}
              onResume={handleResume}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}
