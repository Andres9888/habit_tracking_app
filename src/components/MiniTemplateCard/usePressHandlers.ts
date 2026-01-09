/**
 * Press handlers for MiniTemplateCard component
 */

import { SharedValue, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface AnimationValues {
  pressScale: SharedValue<number>;
  pressRotation: SharedValue<number>;
  shadowElevation: SharedValue<number>;
  chevronTranslate: SharedValue<number>;
}

export function createPressHandlers(
  animations: AnimationValues,
  reducedMotion: boolean,
  onPress: () => void
) {
  const { pressScale, pressRotation, shadowElevation, chevronTranslate } =
    animations;

  const handlePressIn = () => {
    if (reducedMotion) {
      pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    } else {
      pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      shadowElevation.value = withTiming(8, { duration: 100 });
      pressRotation.value = withSpring(-0.5, { damping: 20, stiffness: 400 });
      chevronTranslate.value = withSpring(2, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    if (!reducedMotion) {
      shadowElevation.value = withTiming(3, { duration: 150 });
      pressRotation.value = withSpring(0, { damping: 15, stiffness: 300 });
      chevronTranslate.value = withSpring(0, { damping: 15, stiffness: 300 });
    }
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return { handlePress, handlePressIn, handlePressOut };
}

export function createImportHandler(
  isImporting: boolean | undefined,
  isImported: boolean | undefined,
  onImport: (() => void) | undefined
) {
  return () => {
    if (isImporting || isImported || !onImport) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onImport();
  };
}
