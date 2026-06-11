/**
 * ProblemChips — two-column intake cards answering the hero question.
 */

import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import {
  GOAL_COLLECTIONS,
  type GoalCollection,
} from '../../data/goalCollections';
import { styles as s } from './ProblemChips.styles';

interface ProblemChipsProps {
  importedStepCounts?: Record<string, number>;
  onSelectGoal: (goal: GoalCollection) => void;
  selectedGoalId: string | null;
}

export function ProblemChips({
  importedStepCounts = {},
  onSelectGoal,
  selectedGoalId,
}: ProblemChipsProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.grid}>
      {GOAL_COLLECTIONS.map((goal, index) => {
        const isSelected = selectedGoalId === goal.id;
        const importedCount = importedStepCounts[goal.id] ?? 0;
        const showProgress = isSelected && importedCount > 0;
        const isWide = index === GOAL_COLLECTIONS.length - 1;

        return (
          <Pressable
            key={goal.id}
            accessibilityLabel={`${goal.problemLabel}: ${goal.promise}`}
            accessibilityRole='button'
            accessibilityState={{ selected: isSelected }}
            style={[
              s.chip,
              isWide ? s.chipWide : s.chipHalf,
              {
                backgroundColor: isSelected ? goal.bgColor : colors.card,
                borderColor: isSelected ? goal.textColor : colors.border,
              },
            ]}
            onPress={() => onSelectGoal(goal)}
          >
            <Text style={s.emoji}>{goal.emoji}</Text>
            <Text
              style={[
                s.label,
                { color: isSelected ? goal.textColor : colors.text.primary },
              ]}
            >
              {goal.problemLabel}
            </Text>
            {showProgress ? (
              <View style={s.progressBadge}>
                <Text style={s.progressText}>{importedCount} of 2</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
