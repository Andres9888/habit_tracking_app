/**
 * SectionHeader Component
 * Pressable header with icon, label, count, and chevron
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';

import type { CategoryColors } from './types';
import { CountBadge } from './CountBadge';
import { styles } from './styles';

interface SectionHeaderProps {
  label: string;
  icon: string;
  templateCount: number;
  scienceCount: number;
  isExpanded: boolean;
  colors: CategoryColors;
  headerAnimatedStyle: AnimatedStyle;
  iconAnimatedStyle: AnimatedStyle;
  chevronAnimatedStyle: AnimatedStyle;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function SectionHeader({
  label,
  icon,
  templateCount,
  scienceCount,
  isExpanded,
  colors,
  headerAnimatedStyle,
  iconAnimatedStyle,
  chevronAnimatedStyle,
  onPress,
  onPressIn,
  onPressOut,
}: SectionHeaderProps) {
  const habitsText = templateCount === 1 ? 'habit' : 'habits';
  const accessibilityLabel = `${label} category, ${templateCount} ${habitsText}${
    scienceCount > 0 ? `, ${scienceCount} science-backed` : ''
  }, ${isExpanded ? 'expanded' : 'collapsed'}`;

  return (
    <Pressable
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ expanded: isExpanded }}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: isExpanded ? colors.bg : '#fff',
            borderLeftColor: isExpanded ? colors.bgSelected : 'transparent',
          },
          headerAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.iconBadge,
            { backgroundColor: `${colors.bgSelected}20` },
            iconAnimatedStyle,
          ]}
        >
          <Text style={styles.icon}>{icon}</Text>
        </Animated.View>

        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              { color: isExpanded ? colors.bgSelected : '#374151' },
            ]}
          >
            {label}
          </Text>
          <CountBadge
            scienceCount={scienceCount}
            templateCount={templateCount}
          />
        </View>

        <Animated.View style={[styles.chevronContainer, chevronAnimatedStyle]}>
          <ChevronDown
            color={isExpanded ? colors.bgSelected : '#6B7280'}
            size={20}
            strokeWidth={2.5}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
