/**
 * HabitCardContent Component
 * Inner content of the HabitCard including name, icon, streak, and progress
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { AppTheme } from '../../../theme';
import { StrengthProgressBar } from '../../StrengthProgressBar/StrengthProgressBar';
import { styles } from '../HabitCard.styles';
import { streakStyles } from '../HabitCard.streakStyles';
import { StatusIndicator } from './StatusIndicator';
import { StreakBadge } from './StreakBadge';

interface HabitCardContentProps {
  name: string;
  icon: string;
  strength: number;
  currentStreak: number;
  bestStreak: number;
  completed: boolean;
  atRisk: boolean;
  theme: AppTheme;
  entranceContentStyle: AnimatedStyle<object>;
  checkmarkAnimatedStyle: AnimatedStyle<object>;
  rippleAnimatedStyle: AnimatedStyle<object>;
}

export function HabitCardContent({
  name,
  icon,
  strength,
  currentStreak,
  bestStreak,
  completed,
  atRisk,
  theme,
  entranceContentStyle,
  checkmarkAnimatedStyle,
  rippleAnimatedStyle,
}: HabitCardContentProps) {
  return (
    <Animated.View style={[styles.content, entranceContentStyle]}>
      <View style={styles.topRow}>
        <View style={styles.habitInfo}>
          <Text style={styles.icon}>{icon}</Text>
          <Text
            numberOfLines={1}
            style={[
              theme.custom.typography.heading3,
              { color: theme.custom.colors.gray[900] },
              completed && styles.completedText,
            ]}
          >
            {name}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <StatusIndicator
            atRisk={atRisk}
            checkmarkAnimatedStyle={checkmarkAnimatedStyle}
            completed={completed}
          />
        </View>
      </View>

      <StreakBadge bestStreak={bestStreak} currentStreak={currentStreak} />
      <Animated.View
        pointerEvents='none'
        style={[streakStyles.rippleOverlay, rippleAnimatedStyle]}
      />

      <View style={styles.bottomRow}>
        <StrengthProgressBar
          showEmoji
          showNextLevel
          showPercentage
          size='compact'
          strength={strength}
        />
      </View>
    </Animated.View>
  );
}
