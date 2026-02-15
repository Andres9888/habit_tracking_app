/**
 * Animation hooks for MiniTemplateCard component
 */

import {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {
  useScienceBadgePulse,
  useButtonPulse,
  useSuccessAnimation,
} from './useAnimationEffects';

interface UseAnimationOptions {
  reducedMotion: boolean;
  hasResearch?: boolean;
  isImporting?: boolean;
  isImported?: boolean;
  hasImportHandler: boolean;
}

export function useMiniTemplateCardAnimations(options: UseAnimationOptions) {
  const {
    reducedMotion,
    hasResearch,
    isImporting,
    isImported,
    hasImportHandler,
  } = options;

  const pressScale = useSharedValue(1);
  const pressRotation = useSharedValue(0);
  const shadowElevation = useSharedValue(3);
  const buttonPulse = useSharedValue(1);
  const checkmarkScale = useSharedValue(0);
  const successGlow = useSharedValue(0);
  const chevronTranslate = useSharedValue(0);
  const scienceBadgePulse = useSharedValue(1);

  useScienceBadgePulse(
    scienceBadgePulse,
    reducedMotion,
    hasResearch,
    isImported
  );
  useButtonPulse(
    buttonPulse,
    reducedMotion,
    isImporting,
    isImported,
    hasImportHandler
  );
  useSuccessAnimation(isImported, checkmarkScale, successGlow, buttonPulse);

  return {
    buttonPulse,
    checkmarkScale,
    chevronTranslate,
    pressRotation,
    pressScale,
    scienceBadgePulse,
    shadowElevation,
    successGlow,
  };
}

export function useAnimatedCardStyle(
  shadowElevation: SharedValue<number>,
  pressScale: SharedValue<number>,
  pressRotation: SharedValue<number>
) {
  return useAnimatedStyle(() => {
    'worklet';
    const elevation = shadowElevation.value ?? 3;
    const scale = pressScale.value ?? 1;
    const rotation = pressRotation.value ?? 0;
    return {
      elevation,
      shadowOpacity: interpolate(elevation, [3, 8], [0.08, 0.15]),
      transform: [
        { scale },
        { rotate: `${Math.round(rotation)}deg` },
      ],
    };
  });
}
