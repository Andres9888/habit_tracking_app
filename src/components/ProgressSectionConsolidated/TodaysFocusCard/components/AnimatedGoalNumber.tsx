/**
 * AnimatedGoalNumber Component
 *
 * Wrapper component that displays the animated goal number
 * with styling. Delegates animation logic to GoalValueDisplay.
 */

import React from 'react';
import { Text } from 'react-native';

import { GoalValueDisplay } from './GoalValueDisplay';
import { styles } from '../TodaysFocusCard.styles';

export interface AnimatedGoalNumberProps {
  targetValue: number;
  color: string;
  reduceMotion: boolean;
}

export const AnimatedGoalNumber = React.memo(function AnimatedGoalNumber({
  targetValue,
  color,
  reduceMotion,
}: AnimatedGoalNumberProps) {
  return (
    <Text style={[styles.goalValue, { color }]}>
      <GoalValueDisplay reduceMotion={reduceMotion} targetValue={targetValue} />
    </Text>
  );
});

export default AnimatedGoalNumber;
