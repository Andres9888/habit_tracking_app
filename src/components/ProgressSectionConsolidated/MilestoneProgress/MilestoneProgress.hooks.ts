import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import type { MilestoneDisplayState } from '../MilestoneProgressTypes';
import { useAnimationEffects } from './useAnimationEffects';

interface UseMilestoneAnimationsParams {
  reduceMotion: boolean;
  progressPercentage: number;
  daysRemaining: number;
  displayState: MilestoneDisplayState;
  currentStreak: number;
  onMilestoneHit?: (milestone: number) => void;
}

export const useMilestoneAnimations = ({
  reduceMotion,
  progressPercentage,
  daysRemaining,
  displayState,
  currentStreak,
  onMilestoneHit,
}: UseMilestoneAnimationsParams) => {
  const containerScale = useSharedValue(reduceMotion ? 1 : 0.95);
  const containerOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const progressWidth = useSharedValue(reduceMotion ? progressPercentage : 0);
  const badgePulse = useSharedValue(1);
  const celebrationScale = useSharedValue(1);

  const animationValues = {
    badgePulse,
    celebrationScale,
    containerOpacity,
    containerScale,
    progressWidth,
  };

  useAnimationEffects({
    animationValues,
    currentStreak,
    daysRemaining,
    displayState,
    onMilestoneHit,
    progressPercentage,
    reduceMotion,
  });

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgePulse.value }],
  }));

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  return {
    badgeAnimatedStyle,
    celebrationAnimatedStyle,
    containerAnimatedStyle,
    progressAnimatedStyle,
  };
};
