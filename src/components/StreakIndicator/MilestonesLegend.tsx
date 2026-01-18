/**
 * Milestones legend for full StreakIndicator view
 */

import React from 'react';
import { View, Text } from 'react-native';
import {
  MILESTONES,
  MILESTONE_BADGES,
  COLORS,
} from './StreakIndicator.constants';
import { styles } from './StreakIndicator.styles';

interface MilestonesLegendProps {
  currentStreak: number;
}

export function MilestonesLegend({ currentStreak }: MilestonesLegendProps) {
  return (
    <View style={styles.milestonesLegend}>
      {MILESTONES.map((milestone) => {
        const achieved = currentStreak >= milestone;
        const badge = MILESTONE_BADGES[milestone];
        return (
          <View
            key={milestone}
            style={[
              styles.milestoneBadge,
              {
                backgroundColor: achieved
                  ? COLORS.milestoneBadgeBgAchieved
                  : COLORS.milestoneBadgeBgUnachieved,
                borderColor: achieved
                  ? COLORS.milestoneBadgeBorder
                  : 'transparent',
                borderWidth: achieved ? 1 : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.milestoneBadgeEmoji,
                { opacity: achieved ? 1 : 0.5 },
              ]}
            >
              {badge.emoji}
            </Text>
            <Text
              style={[
                styles.milestoneBadgeLabel,
                {
                  color: achieved
                    ? COLORS.milestoneLabelAchieved
                    : COLORS.milestoneLabelUnachieved,
                },
              ]}
            >
              {milestone}d
            </Text>
          </View>
        );
      })}
    </View>
  );
}
