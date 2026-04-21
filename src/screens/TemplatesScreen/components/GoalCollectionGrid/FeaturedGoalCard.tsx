/**
 * FeaturedGoalCard — full-width hero card for the time-aware featured goal
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { GoalCollection } from '../../data/goalCollections';
import { fontFamilies, fontWeights } from '@/theme/typography';
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
  const countText =
    habitCount === 1 ? '1 habit · Start here →' : `${habitCount} habits · Start here →`;

  return (
    <Pressable
      accessibilityLabel={`Featured goal: ${goal.label}. ${goal.promise}`}
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
          <Text style={[s.featuredBadge, hero.badge, { color: goal.textColor }]}>
            {badgeLabel}
          </Text>
        </View>
        <View style={hero.body}>
          <Text style={hero.emoji}>{goal.emoji}</Text>
          <View style={hero.text}>
            <Text style={[s.featuredLabel, hero.label, { color: goal.textColor }]}>
              {goal.label}
            </Text>
            <Text
              numberOfLines={2}
              style={[s.promise, hero.promise, { color: goal.textColor }]}
            >
              {goal.promise}
            </Text>
          </View>
        </View>
        <View
          style={[
            hero.cta,
            {
              backgroundColor: goal.textColor,
              borderColor: goal.textColor,
            },
          ]}
        >
          <Text style={[hero.ctaText, { color: '#FFFFFF' }]}>{countText}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const hero = StyleSheet.create({
  badge: { position: 'relative', right: 0, top: 0 },
  body: { alignItems: 'flex-end', flexDirection: 'row', gap: 14, marginTop: 14 },
  cta: {
    alignSelf: 'flex-start',
    borderRadius: 9999,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ctaText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: fontWeights.semibold,
  },
  emoji: { fontSize: 52, lineHeight: 56 },
  gradient: { borderRadius: 16, overflow: 'hidden', padding: 18 },
  label: { fontSize: 22, paddingRight: 0 },
  promise: { fontSize: 13, lineHeight: 18, marginTop: 6, opacity: 0.9 },
  text: { flex: 1, paddingBottom: 4 },
  topRow: { flexDirection: 'row', justifyContent: 'flex-start' },
  wrapper: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: 0,
    justifyContent: 'flex-start',
    minHeight: 0,
    padding: 0,
  },
});
