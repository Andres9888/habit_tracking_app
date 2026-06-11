/**
 * ProblemChips — the library intake. Five struggle-framed chips
 * ("Sleep better", "Stress less") that answer the hero's question.
 * Each chip wears its goal's palette so the pills read clearly on
 * the warm hero gradient. Tapping one routes to that goal's habits.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';
import {
  GOAL_COLLECTIONS,
  type GoalCollection,
} from '../../data/goalCollections';

interface ProblemChipsProps {
  onSelectGoal: (goal: GoalCollection) => void;
}

export function ProblemChips({ onSelectGoal }: ProblemChipsProps) {
  return (
    <View style={s.wrap}>
      {GOAL_COLLECTIONS.map((goal) => (
        <Pressable
          key={goal.id}
          accessibilityLabel={`${goal.problemLabel}: ${goal.promise}`}
          accessibilityRole='button'
          style={[s.chip, { backgroundColor: goal.bgColor }]}
          onPress={() => onSelectGoal(goal)}
        >
          <Text style={s.emoji}>{goal.emoji}</Text>
          <Text style={[s.label, { color: goal.textColor }]}>
            {goal.problemLabel}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    ...shadows.subtle,
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.07)',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  emoji: {
    fontSize: 15,
    lineHeight: 19,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm + 1,
  },
});
