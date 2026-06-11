/**
 * ProblemChips — the library intake. Five struggle-framed chips
 * ("Sleep better", "Stress less") that answer the hero's question.
 * Tapping one routes to that goal's habits.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';
import {
  GOAL_COLLECTIONS,
  type GoalCollection,
} from '../../data/goalCollections';

interface ProblemChipsProps {
  onSelectGoal: (goal: GoalCollection) => void;
}

export function ProblemChips({ onSelectGoal }: ProblemChipsProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.wrap}>
      {GOAL_COLLECTIONS.map((goal) => (
        <Pressable
          key={goal.id}
          accessibilityLabel={`${goal.problemLabel}: ${goal.promise}`}
          accessibilityRole='button'
          style={({ pressed }) => [
            s.chip,
            { borderColor: colors.border },
            pressed && {
              backgroundColor: goal.bgColor,
              borderColor: goal.textColor,
            },
          ]}
          onPress={() => onSelectGoal(goal)}
        >
          <Text style={s.emoji}>{goal.emoji}</Text>
          <Text style={[s.label, { color: colors.text.primary }]}>
            {goal.problemLabel}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md + 1,
    paddingVertical: spacing.sm + 2,
  },
  emoji: { fontSize: 15 },
  label: { ...typography.bodySmall, fontWeight: fontWeights.semibold },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm + 1,
  },
});
