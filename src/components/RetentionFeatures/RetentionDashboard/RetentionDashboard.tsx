/**
 * RetentionDashboard Component
 * Orchestrates all retention features in a cohesive UX
 * Displays the right message at the right time
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SocialProofBanner } from '../SocialProofBanner';
import { ComebackMessage } from '../ComebackMessage';
import { ChainNudge } from '../ChainNudge';
import { SmartHabitSuggestions } from '../SmartHabitSuggestions';
import type { HabitSuggestion } from '../SmartHabitSuggestions';
import { useRetentionFeatures } from '../../../hooks/useRetentionFeatures';

interface HabitWithStreak {
  _id: string;
  name: string;
  currentStreak?: number;
  category?: string;
  completedToday?: boolean;
}

interface RetentionDashboardProps {
  /** User's habits */
  habits: HabitWithStreak[];
  /** Whether user completed anything yesterday */
  completedYesterday: boolean;
  /** User's best streak */
  bestStreak?: number;
  /** Whether user is premium */
  isPremium?: boolean;
  /** Callback when comeback "Start Today" is pressed */
  onStartToday?: () => void;
  /** Callback when chain nudge "Complete Now" is pressed */
  onCompleteNow?: () => void;
  /** Callback when chain nudge is dismissed */
  onDismissNudge?: () => void;
  /** Callback when habit suggestion is selected */
  onSelectSuggestion?: (suggestion: HabitSuggestion) => void;
  /** Reduce motion for accessibility */
  reduceMotion?: boolean;
}

export function RetentionDashboard({
  habits,
  completedYesterday,
  bestStreak,
  isPremium,
  onStartToday,
  onCompleteNow,
  onDismissNudge,
  onSelectSuggestion,
  reduceMotion = false,
}: RetentionDashboardProps) {
  const retention = useRetentionFeatures({
    bestStreak,
    completedYesterday,
    habits,
    isPremium,
  });

  return (
    <View style={styles.container}>
      {/* Social Proof - Top of screen for visibility */}
      {retention.shouldShowSocialProof && (
        <SocialProofBanner
          globalCompletions={retention.globalStats.completionsToday}
          activeUsers={retention.globalStats.activeUsers}
          visible
          reduceMotion={reduceMotion}
        />
      )}

      {/* Comeback Message - Priority for returning users */}
      {retention.shouldShowComebackMessage && (
        <ComebackMessage
          daysMissed={retention.daysSinceLastActivity}
          bestStreak={bestStreak}
          onStartToday={onStartToday}
          reduceMotion={reduceMotion}
        />
      )}

      {/* Chain Nudge - Time-sensitive reminder */}
      {retention.shouldShowChainNudge && retention.highestStreakHabit && (
        <ChainNudge
          streak={retention.highestStreakHabit.currentStreak ?? 0}
          incompleteCount={retention.incompleteHabits.length}
          totalCount={habits.length}
          habitName={
            retention.incompleteHabits.length === 1
              ? retention.highestStreakHabit.name
              : undefined
          }
          onCompleteNow={onCompleteNow}
          onDismiss={onDismissNudge}
          reduceMotion={reduceMotion}
        />
      )}

      {/* Smart Suggestions - Growth opportunity */}
      {retention.shouldShowSmartSuggestions && (
        <SmartHabitSuggestions
          existingCategories={retention.userCategories}
          completionRate={retention.completionRate}
          onSelectSuggestion={onSelectSuggestion}
          reduceMotion={reduceMotion}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
