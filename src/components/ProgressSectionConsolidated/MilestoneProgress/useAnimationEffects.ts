import { useEffect } from 'react';
import {
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Springs } from '../../../constants/motion';
import { MILESTONES } from '../MilestoneProgressTypes';
import {
  ENTRANCE_DURATION,
  PROGRESS_BAR_DURATION,
  PULSE_DURATION,
} from './animation.constants';
import type { UseAnimationEffectsParams } from './useAnimationEffects.types';
import { durations } from '@/theme/animations';

export const useAnimationEffects = ({
  animationValues,
  reduceMotion,
  progressPercentage,
  daysRemaining,
  displayState,
  currentStreak,
  onMilestoneHit,
}: UseAnimationEffectsParams) => {
  const {
    containerScale,
    containerOpacity,
    progressWidth,
    badgePulse,
    celebrationScale,
  } = animationValues;

  // Entrance animation
  useEffect(() => {
    if (reduceMotion) {
      containerScale.value = 1;
      containerOpacity.value = 1;
      progressWidth.value = progressPercentage;
      return;
    }

    containerScale.value = withSpring(1, Springs.gentle);
    containerOpacity.value = withTiming(1, {
      duration: ENTRANCE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    progressWidth.value = withTiming(progressPercentage, {
      duration: PROGRESS_BAR_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [
    reduceMotion,
    progressPercentage,
    containerScale,
    containerOpacity,
    progressWidth,
  ]);

  // Badge pulse animation
  useEffect(() => {
    if (reduceMotion || daysRemaining > 3) {
      badgePulse.value = 1;
      return;
    }

    badgePulse.value = withRepeat(
      withSequence(
        withTiming(1.1, {
          duration: PULSE_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: PULSE_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, [reduceMotion, daysRemaining, badgePulse]);

  // Celebration animation
  useEffect(() => {
    if (displayState !== 'just-hit' || reduceMotion) {
      celebrationScale.value = 1;
      return;
    }

    celebrationScale.value = withSequence(
      withSpring(1.2, Springs.celebration),
      withTiming(1, { duration: durations.complex })
    );

    if (onMilestoneHit) {
      const justHitMilestone = MILESTONES.find((m) => m.days === currentStreak);
      if (justHitMilestone) {
        onMilestoneHit(justHitMilestone.days);
      }
    }
  }, [
    displayState,
    reduceMotion,
    celebrationScale,
    onMilestoneHit,
    currentStreak,
  ]);
};
