/**
 * MilestoneCelebration Integration Example
 *
 * This file demonstrates how to integrate the MilestoneCelebration component
 * with habit tracking logic using the useMilestoneDetection hook.
 *
 * INTEGRATION STEPS:
 * 1. Import useMilestoneDetection hook
 * 2. Pass habit data (id, name, strength) to the hook
 * 3. Render MilestoneCelebration when milestone is detected
 * 4. Call clearMilestone when modal is dismissed
 *
 * Example usage in your main app:
 * ```tsx
 * // In HabitsApp or similar component
 * import { useMilestoneDetection } from './hooks/useMilestoneDetection';
 * import MilestoneCelebration from './components/MilestoneCelebration';
 *
 * function HabitsApp() {
 *   // Your existing habit data
 *   const habits = useQuery(api.habits.list);
 *
 *   // Track milestones for currently selected/active habit
 *   const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
 *   const activeHabit = habits?.find(h => h._id === activeHabitId);
 *
 *   const { milestone, clearMilestone } = useMilestoneDetection(
 *     activeHabit?._id,
 *     activeHabit?.name,
 *     activeHabit?.strength
 *   );
 *
 *   // Handle share action (optional)
 *   const handleShare = () => {
 *     // Navigate to share card generator
 *     // Or trigger share flow
 *   };
 *
 *   return (
 *     <>
 *       {/* Your existing UI *\/}
 *       <HabitList habits={habits} onToggle={(id) => {
 *         setActiveHabitId(id);
 *         toggleHabit({ id });
 *       }} />
 *
 *       {/* Milestone Celebration Modal *\/}
 *       {milestone && (
 *         <MilestoneCelebration
 *           visible={true}
 *           level={milestone.level}
 *           strength={milestone.strength}
 *           habitName={milestone.habitName}
 *           onClose={clearMilestone}
 *           onShare={handleShare}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from './Button';
import MilestoneCelebration from './MilestoneCelebration';
import { useMilestoneDetection } from '../hooks/useMilestoneDetection';
import { useAppTheme } from '../theme';
import type { StrengthLevel } from './HabitStrengthIndicator/HabitStrengthIndicator';

/**
 * Demo Component - Shows how the celebration triggers
 */
export function MilestoneCelebrationExample() {
  const theme = useAppTheme();

  // Simulate habit data
  const [habitStrength, setHabitStrength] = useState(15);
  const habitId = 'demo-habit-1';
  const habitName = 'Morning Meditation';

  // Use the milestone detection hook
  const { milestone, clearMilestone } = useMilestoneDetection(
    habitId,
    habitName,
    habitStrength
  );

  // Simulate strength increases to trigger milestones
  const simulateMilestone = (targetLevel: StrengthLevel) => {
    const thresholds = {
      automatic: 85,
      building: 25,
      developing: 45,
      starting: 15,
      strong: 65,
    };

    setHabitStrength(thresholds[targetLevel]);
  };

  // Handle share (in real app, this would navigate to share flow)
  const handleShare = () => {
    console.log('Share milestone achievement:', milestone);
    // In real implementation:
    // navigation.navigate('ShareCard', { milestone });
    clearMilestone();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text
          style={[
            theme.custom.typography.heading2,
            styles.title,
            { color: theme.custom.colors.gray[900] },
          ]}
        >
          Milestone Celebration Demo
        </Text>

        <Text
          style={[
            theme.custom.typography.body,
            styles.description,
            { color: theme.custom.colors.gray[600] },
          ]}
        >
          Tap a button below to simulate reaching a milestone threshold and
          trigger the celebration modal.
        </Text>

        {/* Current State */}
        <View
          style={[
            styles.stateBox,
            { backgroundColor: theme.custom.colors.gray[50] },
          ]}
        >
          <Text
            style={[
              theme.custom.typography.bodySmall,
              { color: theme.custom.colors.gray[700] },
            ]}
          >
            Current Strength: {habitStrength}%
          </Text>
          <Text
            style={[
              theme.custom.typography.caption,
              { color: theme.custom.colors.gray[500] },
            ]}
          >
            Habit: {habitName}
          </Text>
        </View>

        {/* Trigger Buttons */}
        <View style={styles.buttonGroup}>
          <Text
            style={[
              theme.custom.typography.heading3,
              { color: theme.custom.colors.gray[800] },
            ]}
          >
            Trigger Milestones
          </Text>

          <Button
            size='medium'
            variant='primary'
            onPress={() => simulateMilestone('building')}
          >
            🌿 Building (20%)
          </Button>

          <Button
            size='medium'
            variant='primary'
            onPress={() => simulateMilestone('developing')}
          >
            🌳 Developing (40%)
          </Button>

          <Button
            size='medium'
            variant='primary'
            onPress={() => simulateMilestone('strong')}
          >
            💪 Strong (60%)
          </Button>

          <Button
            size='medium'
            variant='primary'
            onPress={() => simulateMilestone('automatic')}
          >
            ⚡ Automatic (80%)
          </Button>
        </View>

        {/* Integration Code Example */}
        <View style={styles.codeSection}>
          <Text
            style={[
              theme.custom.typography.heading3,
              { color: theme.custom.colors.gray[800] },
            ]}
          >
            Integration Code
          </Text>

          <View
            style={[
              styles.codeBox,
              { backgroundColor: theme.custom.colors.gray[900] },
            ]}
          >
            <Text
              style={[
                theme.custom.typography.bodySmall,
                {
                  color: theme.custom.colors.gray[50],
                  fontFamily: theme.custom.fontFamilies.monospace,
                },
              ]}
            >
              {`// Step 1: Import the hook and component
import { useMilestoneDetection } from './hooks/useMilestoneDetection';
import MilestoneCelebration from './components/MilestoneCelebration';

// Step 2: Use in your component
const { milestone, clearMilestone } = useMilestoneDetection(
  habit._id,
  habit.name,
  habit.strength
);

// Step 3: Render celebration modal
{milestone && (
  <MilestoneCelebration
    visible={true}
    level={milestone.level}
    strength={milestone.strength}
    habitName={milestone.habitName}
    onClose={clearMilestone}
    onShare={handleShare}
  />
)}`}
            </Text>
          </View>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text
            style={[
              theme.custom.typography.heading3,
              { color: theme.custom.colors.gray[800] },
            ]}
          >
            Features Implemented
          </Text>

          <View style={styles.featuresList}>
            {[
              '✅ Full-screen modal with backdrop',
              '✅ Confetti animation (100 particles)',
              '✅ Badge display with emoji and glow effect',
              '✅ Spring animations for badge bounce',
              '✅ Haptic feedback on open and badge scale',
              '✅ Strength percentage counter animation',
              '✅ Share CTA button with slide-up animation',
              '✅ Reduce Motion accessibility support',
              '✅ VoiceOver announcements',
              '✅ Milestone detection hook with duplicate prevention',
            ].map((feature, index) => (
              <Text
                key={index}
                style={[
                  theme.custom.typography.bodySmall,
                  { color: theme.custom.colors.gray[700] },
                ]}
              >
                {feature}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Milestone Celebration Modal */}
      {milestone && (
        <MilestoneCelebration
          visible
          habitName={milestone.habitName}
          level={milestone.level}
          strength={milestone.strength}
          onClose={clearMilestone}
          onShare={handleShare}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    gap: 12,
  },
  codeBox: {
    borderRadius: 8,
    overflow: 'scroll',
    padding: 16,
  },
  codeSection: {
    gap: 12,
  },
  container: {
    flex: 1,
  },
  content: {
    gap: 24,
    padding: 24,
  },
  description: {
    marginBottom: 16,
  },
  featuresList: {
    gap: 8,
  },
  featuresSection: {
    gap: 12,
  },
  stateBox: {
    borderRadius: 8,
    gap: 4,
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
});

export default MilestoneCelebrationExample;
