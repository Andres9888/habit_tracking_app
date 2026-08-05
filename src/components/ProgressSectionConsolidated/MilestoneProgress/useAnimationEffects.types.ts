/**
 * useAnimationEffects Types
 *
 * Types for milestone progress animation hook.
 * Manages celebration animations and progress transitions.
 */

import type { SharedValue } from 'react-native-reanimated';
import type { MilestoneDisplayState } from '../MilestoneProgressTypes';

export interface AnimationValues {
  containerScale: SharedValue<number>;
  containerOpacity: SharedValue<number>;
  progressWidth: SharedValue<number>;
  badgePulse: SharedValue<number>;
  celebrationScale: SharedValue<number>;
}

export interface UseAnimationEffectsParams {
  animationValues: AnimationValues;
  reduceMotion: boolean;
  progressPercentage: number;
  daysRemaining: number;
  displayState: MilestoneDisplayState;
  currentStreak: number;
  onMilestoneHit?: (milestone: number) => void;
}
