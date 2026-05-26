/**
 * FeaturedGoalCard — hero card for the featured transformation.
 * Big emoji + label + promise, 3 inline starter habits, primary CTA.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import type { GoalCollection } from '../../data/goalCollections';
import { s } from './GoalCollectionGrid.styles';
import { hero } from './FeaturedGoalCard.styles';
import { FeaturedGoalStarterRow } from './FeaturedGoalStarterRow';

interface FeaturedGoalCardProps {
  badgeLabel: string;
  goal: GoalCollection;
  habitCount: number;
  onPress: () => void;
  onPreviewStarter: (template: Doc<'templates'>) => void;
  starterTemplates: Doc<'templates'>[];
}

export function FeaturedGoalCard({
  badgeLabel,
  goal,
  habitCount,
  onPress,
  onPreviewStarter,
  starterTemplates,
}: FeaturedGoalCardProps) {
  const ctaLabel = 'Start your path';
  const countLabel =
    habitCount === 1 ? '1 habit inside' : `${habitCount} habits inside`;

  return (
    <Pressable
      accessibilityLabel={`${goal.label}. ${goal.promise}. Outcome: ${goal.outcome}. ${countLabel}`}
      accessibilityRole='button'
      style={[s.card, s.featuredCard, hero.wrapper]}
      onPress={onPress}
    >
      <LinearGradient
        colors={[goal.bgColor, `${goal.textColor}1F`]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={hero.gradient}
      >
        <View style={hero.topRow}>
          <Text style={[hero.badge, { color: goal.textColor }]}>
            {badgeLabel}
          </Text>
        </View>
        <View style={hero.body}>
          <Text style={hero.emoji}>{goal.emoji}</Text>
          <View style={hero.text}>
            <Text style={[hero.label, { color: goal.textColor }]}>
              {goal.label}
            </Text>
            <Text
              numberOfLines={2}
              style={[hero.promise, { color: goal.textColor }]}
            >
              {goal.promise}
            </Text>
            <View
              style={[
                hero.outcome,
                { backgroundColor: `${goal.textColor}1A` },
              ]}
            >
              <Text
                numberOfLines={1}
                style={[hero.outcomeText, { color: goal.textColor }]}
              >
                ✦ {goal.outcome}
              </Text>
            </View>
          </View>
        </View>
        <FeaturedGoalStarterRow
          accentColor={goal.textColor}
          templates={starterTemplates}
          onPreview={onPreviewStarter}
        />
        <View style={[hero.cta, { backgroundColor: goal.textColor }]}>
          <Text style={[hero.ctaPrimary, { color: '#FFFFFF' }]}>
            {ctaLabel} →
          </Text>
          <Text style={[hero.ctaCount, { color: '#FFFFFF' }]}>
            · {countLabel}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
