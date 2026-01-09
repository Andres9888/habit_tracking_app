import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

/**
 * Hook that manages all animation state for the habits header buttons.
 * Creates shared values and animated styles for each button.
 */
export function useHeaderAnimations() {
  // Animated values for each button
  const addButtonScale = useSharedValue(1);
  const sortButtonScale = useSharedValue(1);
  const templatesButtonScale = useSharedValue(1);
  const settingsButtonScale = useSharedValue(1);

  // Animated styles derived from shared values
  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));

  const sortButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sortButtonScale.value }],
  }));

  const templatesButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templatesButtonScale.value }],
  }));

  const settingsButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: settingsButtonScale.value }],
  }));

  return {
    addButtonAnimatedStyle,
    addButtonScale,
    settingsButtonAnimatedStyle,
    settingsButtonScale,
    sortButtonAnimatedStyle,
    sortButtonScale,
    templatesButtonAnimatedStyle,
    templatesButtonScale,
  };
}
