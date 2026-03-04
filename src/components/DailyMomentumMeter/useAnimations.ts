import { useSharedValue, type Animated } from 'react-native-reanimated';
import { useAnimationStyles } from './useAnimations.styles';
import { useAnimationEffects } from './useAnimationsEffects';

interface AnimationValues {
  progressAnim: number;
  celebrationScale: number;
  glowOpacity: number;
  flameScale: number;
  progressAnimatedStyle: ReturnType<
    typeof useAnimationStyles
  >['progressAnimatedStyle'];
  celebrationAnimatedStyle: ReturnType<
    typeof useAnimationStyles
  >['celebrationAnimatedStyle'];
  glowAnimatedStyle: ReturnType<typeof useAnimationStyles>['glowAnimatedStyle'];
  flameAnimatedStyle: ReturnType<
    typeof useAnimationStyles
  >['flameAnimatedStyle'];
}

export function useAnimations(
  percentage: number,
  reduceMotion: boolean
): AnimationValues {
  const progressAnim = useSharedValue(0);
  const celebrationScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const flameScale = useSharedValue(1);

  useAnimationEffects(
    percentage,
    reduceMotion,
    progressAnim,
    celebrationScale,
    glowOpacity,
    flameScale
  );

  const {
    progressAnimatedStyle,
    celebrationAnimatedStyle,
    glowAnimatedStyle,
    flameAnimatedStyle,
  } = useAnimationStyles(
    progressAnim,
    celebrationScale,
    glowOpacity,
    flameScale
  );

  return {
    celebrationAnimatedStyle,
    celebrationScale: celebrationScale.value,
    flameAnimatedStyle,
    flameScale: flameScale.value,
    glowAnimatedStyle,
    glowOpacity: glowOpacity.value,
    progressAnim: progressAnim.value,
    progressAnimatedStyle,
  };
}
