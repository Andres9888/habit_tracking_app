/**
 * FocusTextContent Component
 *
 * Displays the message and goal information for the focus card.
 */

import React from 'react';
import { View, Text } from 'react-native';

import type { FocusState, FocusStateConfig } from '../../TodaysFocusCardTypes';
import { styles } from '../TodaysFocusCard.styles';
import { AnimatedGoalNumber } from './AnimatedGoalNumber';

export interface FocusTextContentProps {
  focusState: FocusState;
  config: FocusStateConfig;
  message: string;
  goalValue: number;
  goalLabel: string;
  celebrationSubtext: string | null;
  nextMilestoneLabel: string | null;
  reduceMotion: boolean;
}

export function FocusTextContent({
  focusState,
  config,
  message,
  goalValue,
  goalLabel,
  celebrationSubtext,
  nextMilestoneLabel,
  reduceMotion,
}: FocusTextContentProps) {
  return (
    <View style={styles.textContainer}>
      <Text style={[styles.message, { color: config.textColor }]}>
        {message}
      </Text>

      {focusState === 'celebrating' && celebrationSubtext ? (
        <View style={styles.celebrationContent}>
          <Text
            style={[styles.celebrationSubtext, { color: config.subTextColor }]}
          >
            {celebrationSubtext}
          </Text>
          {nextMilestoneLabel ? <Text
              style={[styles.nextMilestone, { color: config.subTextColor }]}
            >
              {nextMilestoneLabel}
            </Text> : null}
        </View>
      ) : (
        <View style={styles.goalRow}>
          <Text style={[styles.goalLabel, { color: config.subTextColor }]}>
            Goal:
          </Text>
          <AnimatedGoalNumber
            color={config.textColor}
            reduceMotion={reduceMotion}
            targetValue={goalValue}
          />
          <Text style={[styles.goalLabel, { color: config.subTextColor }]}>
            {goalLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

export default FocusTextContent;
