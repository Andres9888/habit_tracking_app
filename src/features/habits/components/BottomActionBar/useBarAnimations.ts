/**
 * Spring-based press animations for BottomActionBar icon buttons and FAB.
 *
 * All elements share one press signature to feel like a single system:
 *   scale 0.94 + lift -2px. The FAB additionally ring-pulses on release.
 */

import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { SPRING_CONFIGS } from '../../../../utils/animations/helpers';
import { HapticPatterns } from '../../../../utils/haptics';

export type { CelebrationAnimStyles } from './useCelebrationAnimations';

const FAB_SCALE = 0.94;
const FAB_LIFT = -2;
const SPRING = SPRING_CONFIGS.snappy;
const RING_PULSE_MIN = 0.97;

const fireTapHaptic = () => HapticPatterns.tap();
const fireToggleHaptic = () => HapticPatterns.toggle();

export function useBarAnimations() {
  const settingsScale = useSharedValue(1);
  const settingsLift = useSharedValue(0);
  const templatesScale = useSharedValue(1);
  const templatesLift = useSharedValue(0);
  const addScale = useSharedValue(1);
  const addLift = useSharedValue(0);
  const ringPulse = useSharedValue(1);

  const settingsStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: settingsScale.value },
      { translateY: settingsLift.value },
    ],
  }));
  const templatesStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: templatesScale.value },
      { translateY: templatesLift.value },
    ],
  }));
  const addStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }, { translateY: addLift.value }],
  }));
  const resetAddPress = () => {
    'worklet';
    cancelAnimation(addScale);
    cancelAnimation(addLift);
    cancelAnimation(ringPulse);
    addScale.value = 1;
    addLift.value = 0;
    ringPulse.value = 1;
  };

  // Icon buttons (settings, templates) share one press signature: scale + lift
  // with a tap haptic on press-in. Only the shared values differ.
  const makePress = (
    scale: typeof settingsScale,
    lift: typeof settingsLift
  ) => ({
    pressIn: () => {
      'worklet';
      scale.value = withSpring(FAB_SCALE, SPRING);
      lift.value = withSpring(FAB_LIFT, SPRING);
      runOnJS(fireTapHaptic)();
    },
    pressOut: () => {
      'worklet';
      scale.value = withSpring(1, SPRING);
      lift.value = withSpring(0, SPRING);
    },
  });
  const settingsPress = makePress(settingsScale, settingsLift);
  const templatesPress = makePress(templatesScale, templatesLift);

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
        withSpring(RING_PULSE_MIN, SPRING),
        withSpring(1, SPRING)
      );
    },
    onSettingsPressIn: settingsPress.pressIn,
    onSettingsPressOut: settingsPress.pressOut,
    onTemplatesPressIn: templatesPress.pressIn,
    onTemplatesPressOut: templatesPress.pressOut,
    resetAddPress,
    ringPulse,
    settingsStyle,
    templatesStyle,
  };
}
