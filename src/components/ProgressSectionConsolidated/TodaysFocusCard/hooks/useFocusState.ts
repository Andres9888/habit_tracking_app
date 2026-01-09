/**
 * useFocusState Hook
 *
 * Computes the focus state, goal values, and accessibility labels.
 */

import { useMemo } from 'react';

import type {
  TodaysFocusCardProps,
  FocusState,
} from '../../TodaysFocusCardTypes';
import {
  getCelebrationMilestone,
  getNextCelebrationMilestone,
} from '../../TodaysFocusCardTypes';
import {
  determineFocusState,
  calculateGoalValue,
} from '../TodaysFocusCard.utils';
import { FOCUS_STATE_CONFIGS } from '../TodaysFocusCard.constants';

export interface UseFocusStateResult {
  focusState: FocusState;
  config: (typeof FOCUS_STATE_CONFIGS)[FocusState];
  goalValue: number;
  goalLabel: string;
  message: string;
  celebrationConfig: ReturnType<typeof getCelebrationMilestone>;
  celebrationSubtext: string | null;
  nextMilestoneLabel: string | null;
  accessibilityLabel: string;
}

export function useFocusState(
  props: TodaysFocusCardProps
): UseFocusStateResult {
  const { currentStreak, bestStreak, celebratedMilestones = [] } = props;

  const focusState = useMemo(
    () => determineFocusState(props, celebratedMilestones),
    [props, celebratedMilestones]
  );

  const celebrationConfig = useMemo(
    () =>
      focusState === 'celebrating'
        ? getCelebrationMilestone(currentStreak)
        : null,
    [focusState, currentStreak]
  );

  const config = FOCUS_STATE_CONFIGS[focusState];
  const goalValue = useMemo(
    () => calculateGoalValue(focusState, props),
    [focusState, props]
  );

  const message = useMemo(() => {
    switch (focusState) {
      case 'thriving': {
        return config.getMessage(goalValue);
      }
      case 'building':
      case 'completed':
      case 'celebrating': {
        return config.getMessage(currentStreak);
      }
      case 'recovering': {
        return config.getMessage(bestStreak);
      }
      default: {
        return config.getMessage(0);
      }
    }
  }, [focusState, config, goalValue, currentStreak, bestStreak]);

  const goalLabel = config.getGoalLabel();

  const celebrationSubtext = useMemo(() => {
    if (focusState === 'celebrating' && celebrationConfig) {
      return celebrationConfig.subtext;
    }
    return null;
  }, [focusState, celebrationConfig]);

  const nextMilestoneLabel = useMemo(() => {
    if (focusState === 'celebrating') {
      const nextMilestone = getNextCelebrationMilestone(currentStreak);
      if (nextMilestone) {
        return `Next: ${nextMilestone.days} days ${nextMilestone.badge}`;
      }
    }
    return null;
  }, [focusState, currentStreak]);

  const accessibilityLabel =
    focusState === 'celebrating'
      ? `Milestone celebration: ${message}. ${celebrationSubtext ?? ''}. Next goal: ${goalValue} days`
      : `Today's focus: ${message}. Goal: ${goalValue} ${goalLabel}`;

  return {
    accessibilityLabel,
    celebrationConfig,
    celebrationSubtext,
    config,
    focusState,
    goalLabel,
    goalValue,
    message,
    nextMilestoneLabel,
  };
}
