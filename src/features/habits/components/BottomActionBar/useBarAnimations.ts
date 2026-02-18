/**
 * Spring scale animations for BottomActionBar buttons.
 * Mirrors the header's useHeaderAnimations + createButtonHandlers pattern.
 */

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SPRING_CONFIGS } from '../../../../utils/animations/helpers';

const PRESS_IN_SCALE = 0.9;
const ADD_PRESS_IN_SCALE = 0.92;
const PRESS_DURATION = 50;
const SPRING = SPRING_CONFIGS.entrance;

export function useBarAnimations() {
  const templatesScale = useSharedValue(1);
  const settingsScale = useSharedValue(1);
  const addScale = useSharedValue(1);

  const templatesStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templatesScale.value }],
  }));
  const settingsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: settingsScale.value }],
  }));
  const addStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addScale.value }],
  }));

  const pressIn = (scale: typeof templatesScale, target = PRESS_IN_SCALE) => {
    scale.value = withTiming(target, { duration: PRESS_DURATION });
  };
  const pressOut = (scale: typeof templatesScale) => {
    scale.value = withSpring(1, SPRING);
  };

  return {
    addStyle,
    onAddPressIn: () => pressIn(addScale, ADD_PRESS_IN_SCALE),
    onAddPressOut: () => pressOut(addScale),
    onSettingsPressIn: () => pressIn(settingsScale),
    onSettingsPressOut: () => pressOut(settingsScale),
    onTemplatesPressIn: () => pressIn(templatesScale),
    onTemplatesPressOut: () => pressOut(templatesScale),
    settingsStyle,
    templatesStyle,
  };
}
