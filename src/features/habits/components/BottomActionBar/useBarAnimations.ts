/**
 * Spring-based press animations for BottomActionBar icon buttons and FAB.
 *
 * Each element has a unique micro-interaction signature:
 *   Settings:  scale 0.96 + gear rotation -20°
 *   Inspire:   scale 0.96 + sparkle wiggle (-5° → 5° → 0°)
 *   FAB:       scale 0.94 + lift -2px + ring pulse on release
 */

import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { SPRING_CONFIGS } from '../../../../utils/animations/helpers';
import { HapticPatterns } from '../../../../utils/haptics';

export type { CelebrationAnimStyles } from './useCelebrationAnimations';

const ICON_SCALE = 0.96;
const FAB_SCALE = 0.94;
const FAB_LIFT = -2;
const SPRING = SPRING_CONFIGS.snappy;
const BOUNCE = { damping: 8, stiffness: 300 };

const fireTapHaptic = () => HapticPatterns.tap();
const fireToggleHaptic = () => HapticPatterns.toggle();

export function useBarAnimations() {
  const settingsScale = useSharedValue(1);
  const settingsRotate = useSharedValue(0);
  const templatesScale = useSharedValue(1);
  const templatesRotate = useSharedValue(0);
  const addScale = useSharedValue(1);
  const addLift = useSharedValue(0);
  const ringPulse = useSharedValue(1);

  const settingsStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: settingsScale.value },
      { rotate: `${settingsRotate.value}deg` },
    ],
  }));
  const templatesStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: templatesScale.value },
      { rotate: `${templatesRotate.value}deg` },
    ],
  }));
  const addStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }, { translateY: addLift.value }],
  }));

  return {
    addStyle,
    onAddPressIn: () => {
      'worklet';
      addScale.value = withSpring(FAB_SCALE, SPRING);
      addLift.value = withSpring(FAB_LIFT, SPRING);
      runOnJS(fireToggleHaptic)();
    },
    onAddPressOut: () => {
      'worklet';
      addScale.value = withSpring(1, SPRING);
      addLift.value = withSpring(0, SPRING);
      ringPulse.value = withSequence(
        withSpring(1.05, BOUNCE),
        withSpring(1, SPRING)
      );
    },
    onSettingsPressIn: () => {
      'worklet';
      settingsScale.value = withSpring(ICON_SCALE, SPRING);
      settingsRotate.value = withSpring(-20, SPRING);
      runOnJS(fireTapHaptic)();
    },
    onSettingsPressOut: () => {
      'worklet';
      settingsScale.value = withSpring(1, SPRING);
      settingsRotate.value = withSpring(0, SPRING);
    },
    onTemplatesPressIn: () => {
      'worklet';
      templatesScale.value = withSpring(ICON_SCALE, SPRING);
      templatesRotate.value = withSequence(
        withTiming(-5, { duration: 60 }),
        withTiming(5, { duration: 60 }),
        withTiming(0, { duration: 50 })
      );
      runOnJS(fireTapHaptic)();
    },
    onTemplatesPressOut: () => {
      'worklet';
      templatesScale.value = withSpring(1, SPRING);
    },
    ringPulse,
    settingsStyle,
    templatesStyle,
  };
}
