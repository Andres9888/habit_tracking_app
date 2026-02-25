/**
 * Spring-based press animations for BottomActionBar buttons.
 *
 * Scale hierarchy matches app-wide patterns:
 *   Pills: 0.96 (between HabitCard 0.97 and Chips 0.95)
 *   FAB:   0.94 (matches standalone FloatingActionButton)
 *
 * Haptics: tap (light) for pills, toggle (medium) for FAB.
 */

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { SPRING_CONFIGS } from '../../../../utils/animations/helpers';
import { HapticPatterns } from '../../../../utils/haptics';

export type { CelebrationAnimStyles } from './useCelebrationAnimations';

const PILL_SCALE = 0.96;
const FAB_SCALE = 0.94;
const FAB_LIFT = -2;
const SPRING = SPRING_CONFIGS.snappy;

const fireTapHaptic = () => HapticPatterns.tap();
const fireToggleHaptic = () => HapticPatterns.toggle();

export function useBarAnimations() {
  const settingsScale = useSharedValue(1);
  const templatesScale = useSharedValue(1);
  const addScale = useSharedValue(1);
  const addLift = useSharedValue(0);
  const pillBgShift = useSharedValue(0);

  const settingsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: settingsScale.value }],
  }));
  const templatesStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templatesScale.value }],
  }));
  const addStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }, { translateY: addLift.value }],
  }));
  const pillPressProgress = useAnimatedStyle(() => ({
    opacity: pillBgShift.value,
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
    },
    onSettingsPressIn: () => {
      'worklet';
      settingsScale.value = withSpring(PILL_SCALE, SPRING);
      pillBgShift.value = withSpring(1, SPRING);
      runOnJS(fireTapHaptic)();
    },
    onSettingsPressOut: () => {
      'worklet';
      settingsScale.value = withSpring(1, SPRING);
      pillBgShift.value = withSpring(0, SPRING);
    },
    onTemplatesPressIn: () => {
      'worklet';
      templatesScale.value = withSpring(PILL_SCALE, SPRING);
      pillBgShift.value = withSpring(1, SPRING);
      runOnJS(fireTapHaptic)();
    },
    onTemplatesPressOut: () => {
      'worklet';
      templatesScale.value = withSpring(1, SPRING);
      pillBgShift.value = withSpring(0, SPRING);
    },
    pillPressProgress,
    settingsStyle,
    templatesStyle,
  };
}
