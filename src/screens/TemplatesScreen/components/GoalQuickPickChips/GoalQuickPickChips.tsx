/**
 * Compact horizontal goal chips — one-tap entry to a transformation path.
 */

import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';
import { GOAL_COLLECTIONS, type GoalCollection } from '../../data/goalCollections';

interface GoalQuickPickChipsProps {
  featuredGoalId: string;
  onSelectGoal: (goal: GoalCollection) => void;
}

export function GoalQuickPickChips({
  featuredGoalId,
  onSelectGoal,
}: GoalQuickPickChipsProps) {
  const { colors } = useThemeColors();

  return (
    <ScrollView
      horizontal
      contentContainerStyle={s.rail}
      showsHorizontalScrollIndicator={false}
    >
      {GOAL_COLLECTIONS.map((goal) => {
        const isFeatured = goal.id === featuredGoalId;
        return (
          <Pressable
            key={goal.id}
            accessibilityLabel={`Browse ${goal.label} habits`}
            accessibilityRole='button'
            style={[
              s.chip,
              {
                backgroundColor: goal.bgColor,
                borderColor: isFeatured ? goal.textColor : colors.border,
                borderWidth: isFeatured ? 2 : 1,
              },
            ]}
            onPress={() => onSelectGoal(goal)}
          >
            <Text style={s.emoji}>{goal.emoji}</Text>
            <Text
              numberOfLines={1}
              style={[s.label, { color: goal.textColor }]}
            >
              {goal.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  emoji: { fontSize: 18 },
  label: { ...typography.bodySmall, fontWeight: fontWeights.semibold },
  rail: {
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
});
