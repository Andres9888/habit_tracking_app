/**
 * GoalCollectionGrid — Goal-first hero entry point
 *
 * Frames the page as transformation-driven: featured time-aware goal at top,
 * remaining goals in a 2-column grid below. Tap routes to the goal's habits.
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { GOAL_COLLECTIONS, type GoalCollection } from '../../data/goalCollections';
import { FeaturedGoalCard } from './FeaturedGoalCard';
import { GoalCard } from './GoalCard';
import { s } from './GoalCollectionGrid.styles';

interface GoalCollectionGridProps {
  featuredBadgeLabel?: string;
  featuredGoalId: string;
  featuredStarterTemplates: Doc<'templates'>[];
  habitCountsByGoalId: Record<string, number>;
  onPreviewStarter: (template: Doc<'templates'>) => void;
  onSelectGoal: (goal: GoalCollection) => void;
}

export function GoalCollectionGrid({
  featuredBadgeLabel = 'Today\u2019s pick',
  featuredGoalId,
  featuredStarterTemplates,
  habitCountsByGoalId,
  onPreviewStarter,
  onSelectGoal,
}: GoalCollectionGridProps) {
  const featured =
    GOAL_COLLECTIONS.find((goal) => goal.id === featuredGoalId) ??
    GOAL_COLLECTIONS[0];
  const others = GOAL_COLLECTIONS.filter((goal) => goal.id !== featured.id);

  return (
    <View style={s.container}>
      <FeaturedGoalCard
        badgeLabel={featuredBadgeLabel}
        goal={featured}
        habitCount={habitCountsByGoalId[featured.id] ?? 0}
        starterTemplates={featuredStarterTemplates}
        onPress={() => onSelectGoal(featured)}
        onPreviewStarter={onPreviewStarter}
      />
      <ScrollView
        horizontal
        contentContainerStyle={s.rail}
        showsHorizontalScrollIndicator={false}
      >
        {others.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            habitCount={habitCountsByGoalId[goal.id] ?? 0}
            onPress={() => onSelectGoal(goal)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
