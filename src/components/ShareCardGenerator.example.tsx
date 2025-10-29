/**
 * ShareCardGenerator Example Usage
 *
 * This file demonstrates how to integrate the ShareCardGenerator component
 * into your Milestone Celebration modal or other achievement screens.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ShareCardGenerator,
  type ShareCardData,
  type MilestoneLevel,
} from './ShareCardGenerator';
import { Button } from './Button';

/**
 * Example: Integration with Milestone Celebration Modal
 *
 * When a user reaches a new milestone (e.g., 60% strength = "Strong" level),
 * show the celebration modal with a "Share Your Achievement" button.
 */
export function MilestoneCelebrationExample() {
  const [showShareCard, setShowShareCard] = useState(false);

  // Example habit data from your state/backend
  const habitData: ShareCardData = {
    habitName: 'Morning Meditation',
    milestoneLevel: 'strong' as MilestoneLevel, // 60-80% range
    strengthPercentage: 65,
    userName: 'Alex Johnson', // Optional, from user profile
  };

  return (
    <View style={styles.container}>
      {/* Your celebration modal content here */}
      <Button onPress={() => setShowShareCard(true)}>
        Share Your Achievement
      </Button>

      {/* Share Card Generator Modal */}
      <ShareCardGenerator
        data={habitData}
        visible={showShareCard}
        onClose={() => setShowShareCard(false)}
      />
    </View>
  );
}

/**
 * Example: Determining Milestone Level from Strength Percentage
 *
 * Helper function to map strength percentage to milestone level.
 */
export function getMilestoneLevel(strengthPercentage: number): MilestoneLevel {
  if (strengthPercentage >= 80) return 'automatic'; // ⚡ 80-100%
  if (strengthPercentage >= 60) return 'strong'; // 💪 60-80%
  if (strengthPercentage >= 40) return 'developing'; // 🌳 40-60%
  if (strengthPercentage >= 20) return 'building'; // 🌿 20-40%
  return 'starting'; // 🌱 0-20%
}

/**
 * Example: Triggering Share Card from Analytics Screen
 *
 * Users can also share their achievements from the analytics/stats screen.
 */
export function AnalyticsShareExample() {
  const [showShareCard, setShowShareCard] = useState(false);

  const habit = {
    name: 'Evening Reading',
    strength: 72, // Current strength percentage
    userName: 'Morgan Smith',
  };

  const shareData: ShareCardData = {
    habitName: habit.name,
    milestoneLevel: getMilestoneLevel(habit.strength),
    strengthPercentage: habit.strength,
    userName: habit.userName,
  };

  return (
    <View style={styles.container}>
      <Button onPress={() => setShowShareCard(true)}>Share Progress</Button>

      <ShareCardGenerator
        data={shareData}
        visible={showShareCard}
        onClose={() => setShowShareCard(false)}
      />
    </View>
  );
}

/**
 * Example: Milestone Detection Logic
 *
 * Detect when a user crosses a milestone threshold and trigger celebration.
 */
export function detectMilestoneChange(
  previousStrength: number,
  currentStrength: number
): { crossedMilestone: boolean; newLevel: MilestoneLevel | null } {
  const previousLevel = getMilestoneLevel(previousStrength);
  const currentLevel = getMilestoneLevel(currentStrength);

  const crossedMilestone =
    previousLevel !== currentLevel && currentStrength > previousStrength;

  return {
    crossedMilestone,
    newLevel: crossedMilestone ? currentLevel : null,
  };
}

/**
 * Example: Complete Integration with Habit Completion Flow
 */
export function HabitCompletionFlowExample() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  // Simulate habit completion that triggers milestone
  const handleHabitCompletion = (habitId: string) => {
    // 1. Mark habit as completed in backend
    // 2. Recalculate habit strength
    const previousStrength = 58;
    const newStrength = 62; // Crossed into "Strong" level!

    // 3. Check for milestone crossing
    const { crossedMilestone, newLevel } = detectMilestoneChange(
      previousStrength,
      newStrength
    );

    if (crossedMilestone) {
      // 4. Show celebration modal
      setShowCelebration(true);
    }
  };

  const habitData: ShareCardData = {
    habitName: 'Morning Run',
    milestoneLevel: 'strong',
    strengthPercentage: 62,
    userName: 'Jamie Parker',
  };

  return (
    <View style={styles.container}>
      {/* Celebration Modal */}
      {showCelebration && (
        <View style={styles.celebrationModal}>
          {/* Confetti animation, milestone badge, etc. */}
          <Button
            onPress={() => {
              setShowCelebration(false);
              setShowShareCard(true);
            }}
          >
            Share Your Achievement
          </Button>
        </View>
      )}

      {/* Share Card Generator */}
      <ShareCardGenerator
        data={habitData}
        visible={showShareCard}
        onClose={() => setShowShareCard(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  celebrationModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
});

/**
 * Integration Checklist:
 *
 * ✅ 1. Install dependencies: react-native-view-shot, expo-sharing
 * ✅ 2. Import ShareCardGenerator component
 * ✅ 3. Prepare ShareCardData with habit info and milestone level
 * ✅ 4. Trigger modal when user reaches milestone or manually shares
 * ✅ 5. Test on real device (iOS simulator has sharing limitations)
 * ⚠️  6. Configure Info.plist for photo library access (if saving to camera roll)
 * ⚠️  7. Add analytics tracking for share events
 * ⚠️  8. Consider deep linking for attribution (when users click shared links)
 *
 * Platform Notes:
 * - iOS: Native share sheet works well, but can't pre-fill text for most apps
 * - Android: Similar limitations with ACTION_SEND intent
 * - Instagram: Requires their official SDK for story sharing with pre-filled content
 * - Twitter: Twitter API no longer supports direct tweet posting from third-party apps
 * - Facebook: Similar restrictions on automated posting
 *
 * Recommended Flow:
 * 1. Generate beautiful card image
 * 2. Open native share sheet with image
 * 3. Optionally copy caption to clipboard for user to paste manually
 * 4. Track share completion via analytics
 */
