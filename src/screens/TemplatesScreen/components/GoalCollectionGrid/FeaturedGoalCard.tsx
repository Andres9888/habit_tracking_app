/**
 * FeaturedGoalCard — full-width hero card for the time-aware featured goal
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { GoalCollection } from '../../data/goalCollections';
import { s } from './GoalCollectionGrid.styles';

interface FeaturedGoalCardProps {
  badgeLabel: string;
  goal: GoalCollection;
  habitCount: number;
  onPress: () => void;
}

export function FeaturedGoalCard({
  badgeLabel,
  goal,
  habitCount,
  onPress,
}: FeaturedGoalCardProps) {
  return (
    <Pressable
      accessibilityLabel={`Featured goal: ${goal.label}. ${goal.promise}`}
      accessibilityRole='button'
      style={[s.card, s.featuredCard, { backgroundColor: goal.bgColor }]}
      onPress={onPress}
    >
      <Text style={[s.featuredBadge, { color: goal.textColor }]}>
        {badgeLabel}
      </Text>
      <Text style={s.emojiFeatured}>{goal.emoji}</Text>
      <View style={s.featuredContent}>
        <Text style={[s.featuredLabel, { color: goal.textColor }]}>
          {goal.label}
        </Text>
        <Text
          numberOfLines={2}
          style={[s.promise, { color: goal.textColor }]}
        >
          {goal.promise}
        </Text>
        <Text style={[s.meta, { color: goal.textColor, marginTop: 8 }]}>
          {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
        </Text>
      </View>
      <Text style={[s.arrow, s.arrowFeatured, { color: goal.textColor }]}>
        →
      </Text>
    </Pressable>
  );
}
