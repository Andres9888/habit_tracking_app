/**
 * Goal-based discovery grid
 * "What's your goal?" section for guided habit discovery
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { GOAL_COLLECTIONS, type GoalCollection } from '../../data/goalCollections';

interface GoalCollectionGridProps {
  onSelectGoal: (goal: GoalCollection) => void;
}

export function GoalCollectionGrid({ onSelectGoal }: GoalCollectionGridProps) {
  return (
    <View style={goalStyles.container}>
      <Text style={goalStyles.sectionTitle}>What's your goal?</Text>
      <View style={goalStyles.grid}>
        {GOAL_COLLECTIONS.map((goal) => (
          <Pressable
            key={goal.id}
            style={[goalStyles.card, { backgroundColor: goal.bgColor }]}
            onPress={() => onSelectGoal(goal)}
          >
            <Text style={goalStyles.emoji}>{goal.emoji}</Text>
            <Text style={[goalStyles.label, { color: goal.textColor }]}>
              {goal.label}
            </Text>
            <Text
              numberOfLines={2}
              style={[goalStyles.description, { color: `${goal.textColor}CC` }]}
            >
              {goal.description}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const goalStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    flex: 1,
    minWidth: '45%',
    padding: 14,
  },
  container: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  description: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: fontWeights.semibold,
  },
  sectionTitle: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 17,
    fontWeight: fontWeights.bold,
    marginBottom: 10,
  },
});
