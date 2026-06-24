/**
 * ProblemChips — two-column intake cards answering the hero question.
 */

import { View } from 'react-native';
import {
  GOAL_COLLECTIONS,
  type GoalCollection,
} from '../../data/goalCollections';
import { ProblemChip } from './ProblemChip';
import { styles as s } from './ProblemChips.styles';

interface ProblemChipsProps {
  onSelectGoal: (goal: GoalCollection) => void;
  selectedGoalId: string | null;
}

export function ProblemChips({
  onSelectGoal,
  selectedGoalId,
}: ProblemChipsProps) {
  return (
    <View style={s.grid}>
      {GOAL_COLLECTIONS.map((goal, index) => {
        const isSelected = selectedGoalId === goal.id;
        const isWide = index === GOAL_COLLECTIONS.length - 1;

        return (
          <ProblemChip
            key={goal.id}
            goal={goal}
            isSelected={isSelected}
            isWide={isWide}
            onSelectGoal={onSelectGoal}
          />
        );
      })}
    </View>
  );
}
