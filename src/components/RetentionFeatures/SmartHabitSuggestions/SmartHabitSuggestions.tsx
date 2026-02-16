/**
 * SmartHabitSuggestions Component
 * Suggests new habits based on user's existing tracking patterns
 * Uses category clustering and completion patterns to recommend relevant habits
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

interface HabitSuggestion {
  /** Suggested habit name */
  name: string;
  /** Emoji icon */
  icon: string;
  /** Why this is suggested */
  reason: string;
  /** Related category */
  category?: string;
}

interface SmartHabitSuggestionsProps {
  /** User's existing habit categories */
  existingCategories?: string[];
  /** User's completion rate */
  completionRate?: number;
  /** Callback when user selects a suggestion */
  onSelectSuggestion?: (suggestion: HabitSuggestion) => void;
  /** Whether to reduce animations */
  reduceMotion?: boolean;
}

/**
 * Generate smart suggestions based on user's patterns
 */
function generateSuggestions(
  existingCategories: string[],
  completionRate: number
): HabitSuggestion[] {
  const suggestions: HabitSuggestion[] = [];

  // Health-focused users
  if (existingCategories.includes('health') || existingCategories.includes('fitness')) {
    suggestions.push({
      category: 'health',
      icon: '💧',
      name: 'Drink 8 glasses of water',
      reason: 'Pairs well with your health habits',
    });
    suggestions.push({
      category: 'health',
      icon: '🥗',
      name: 'Eat vegetables with lunch',
      reason: 'Complete your nutrition routine',
    });
  }

  // Productivity-focused users
  if (existingCategories.includes('productivity') || existingCategories.includes('work')) {
    suggestions.push({
      category: 'productivity',
      icon: '🎯',
      name: 'Plan tomorrow tonight',
      reason: 'Boost your productivity',
    });
    suggestions.push({
      category: 'productivity',
      icon: '📧',
      name: 'Inbox zero before lunch',
      reason: 'Stay on top of communication',
    });
  }

  // Mindfulness-focused users
  if (existingCategories.includes('mindfulness') || existingCategories.includes('mental health')) {
    suggestions.push({
      category: 'mindfulness',
      icon: '📔',
      name: 'Evening gratitude journal',
      reason: 'Complement your mindfulness practice',
    });
    suggestions.push({
      category: 'mindfulness',
      icon: '🌅',
      name: 'Morning meditation',
      reason: 'Start your day with calm',
    });
  }

  // Learning-focused users
  if (existingCategories.includes('learning') || existingCategories.includes('education')) {
    suggestions.push({
      category: 'learning',
      icon: '📚',
      name: 'Read for 20 minutes',
      reason: 'Expand your knowledge',
    });
    suggestions.push({
      category: 'learning',
      icon: '🎧',
      name: 'Listen to educational podcast',
      reason: 'Learn during commute',
    });
  }

  // High performers get challenge suggestions
  if (completionRate > 0.8) {
    suggestions.push({
      category: 'challenge',
      icon: '🚀',
      name: 'Cold shower',
      reason: 'Level up your discipline',
    });
    suggestions.push({
      category: 'challenge',
      icon: '📵',
      name: 'No phone first hour',
      reason: 'Master your morning',
    });
  }

  // Default suggestions for new users
  if (suggestions.length === 0) {
    suggestions.push(
      {
        icon: '💧',
        name: 'Drink water when you wake up',
        reason: 'Simple and powerful',
      },
      {
        icon: '🚶',
        name: 'Walk 10,000 steps',
        reason: 'Foundation for health',
      },
      {
        icon: '📝',
        name: 'Write 3 things I'm grateful for',
        reason: 'Boost your mood',
      }
    );
  }

  return suggestions.slice(0, 3); // Return top 3
}

export function SmartHabitSuggestions({
  existingCategories = [],
  completionRate = 0,
  onSelectSuggestion,
  reduceMotion = false,
}: SmartHabitSuggestionsProps) {
  const suggestions = generateSuggestions(existingCategories, completionRate);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={20} color={colors.primary[500]} />
        <Text style={styles.title}>Suggested for You</Text>
      </View>
      <Text style={styles.subtitle}>
        Based on your current habits
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((suggestion, index) => (
          <Animated.View
            key={suggestion.name}
            entering={
              reduceMotion
                ? undefined
                : FadeInRight.duration(280).delay(index * 60)
            }
          >
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => onSelectSuggestion?.(suggestion)}
            >
              <Text style={styles.emoji}>{suggestion.icon}</Text>
              <Text style={styles.habitName}>{suggestion.name}</Text>
              <View style={styles.reasonContainer}>
                <Ionicons
                  name="information-circle"
                  size={14}
                  color={colors.text.tertiary}
                />
                <Text style={styles.reason}>{suggestion.reason}</Text>
              </View>
              {onSelectSuggestion && (
                <View style={styles.addButton}>
                  <Ionicons name="add" size={16} color={colors.primary[600]} />
                  <Text style={styles.addText}>Add</Text>
                </View>
              )}
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addText: {
    color: colors.primary[600],
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.neutral[200],
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    width: 200,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  container: {
    marginVertical: 16,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  habitName: {
    color: colors.text.primary,
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  reason: {
    color: colors.text.tertiary,
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  reasonContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 13,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.text.primary,
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 17,
    fontWeight: '600',
  },
});
