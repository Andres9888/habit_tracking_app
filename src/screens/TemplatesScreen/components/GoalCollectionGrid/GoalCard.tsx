/**
 * GoalCard — single non-featured transformation card (2-column grid item)
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { GoalCollection } from '../../data/goalCollections';
import { s } from './GoalCollectionGrid.styles';

interface GoalCardProps {
  goal: GoalCollection;
  habitCount: number;
  onPress: () => void;
}

export function GoalCard({ goal, habitCount, onPress }: GoalCardProps) {
  return (
    <Pressable
      accessibilityLabel={`${goal.label}: ${goal.promise}`}
      accessibilityRole='button'
      style={[s.card, s.gridCard, { backgroundColor: goal.bgColor }]}
      onPress={onPress}
    >
      <View>
        <Text style={s.emoji}>{goal.emoji}</Text>
        <Text style={[s.label, { color: goal.textColor }]}>{goal.label}</Text>
        <Text
          numberOfLines={2}
          style={[s.promise, { color: goal.textColor }]}
        >
          {goal.promise}
        </Text>
      </View>
      <View style={s.cardBottomRow}>
        <Text style={[s.meta, { color: goal.textColor }]}>
          {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
        </Text>
        <Text style={[s.arrow, { color: goal.textColor }]}>→</Text>
      </View>
    </Pressable>
  );
}
