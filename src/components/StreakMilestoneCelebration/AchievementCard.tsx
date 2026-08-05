/**
 * AchievementCard Component
 * Shareable card showing streak milestone achievement
 *
 * Designed for social sharing (Instagram, Twitter, etc.)
 * Uses gradient backgrounds with milestone-specific colors
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { achievementCardStyles as styles } from './styles';
import type { AchievementCardProps } from './types';

/**
 * Generate gradient colors for a milestone
 */
function getGradientColors(baseColor: string): [string, string, string] {
  // Create darker and lighter variants
  // Base colors are: #10b981 (green), #f59e0b (amber), #8b5cf6 (violet)
  const gradients: Record<string, [string, string, string]> = {
    // Amber gradient
'#8b5cf6': ['#7c3aed', '#8b5cf6', '#a78bfa'], 
    
'#10b981': ['#059669', '#10b981', '#34d399'], 
    // Emerald gradient
'#f59e0b': ['#d97706', '#f59e0b', '#fbbf24'], // Violet gradient
  };

  return gradients[baseColor] || ['#059669', '#10b981', '#34d399'];
}

export function AchievementCard({
  milestone,
  habitName,
  streakDays,
  habitEmoji = '⭐',
  viewRef,
}: AchievementCardProps) {
  const gradientColors = getGradientColors(milestone.color);

  return (
    <View ref={viewRef} collapsable={false} style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        {/* Achievement Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeEmoji}>{milestone.emoji}</Text>
        </View>

        {/* Milestone Title */}
        <Text style={styles.title}>{milestone.title}</Text>

        {/* Streak Count */}
        <Text style={styles.streakText}>{streakDays}</Text>
        <Text style={styles.daysLabel}>day streak</Text>

        {/* Habit Info */}
        <View style={styles.habitContainer}>
          <Text style={styles.habitEmoji}>{habitEmoji}</Text>
          <Text numberOfLines={1} style={styles.habitName}>
            {habitName}
          </Text>
        </View>

        {/* App Branding */}
        <Text style={styles.appBranding}>Chain Day</Text>
      </LinearGradient>
    </View>
  );
}

export default AchievementCard;
