/**
 * Press handlers for MiniTemplateCard component
 */

import { triggerHaptic } from '@/utils/haptics';
import { SharedValue, withSpring, withTiming } from 'react-native-reanimated';
import {
  CARD_PRESS_SPRING_CONFIG,
  CARD_PRESS_SCALE,
  CARD_REST_SCALE,
} from '../../utils/animations/cardPressAnimation';

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
      pressScale.value = withSpring(
        CARD_PRESS_SCALE,
        CARD_PRESS_SPRING_CONFIG
      );
    } else {
      pressScale.value = withSpring(
        CARD_PRESS_SCALE,
        CARD_PRESS_SPRING_CONFIG
      );
      shadowElevation.value = withTiming(8, { duration: 100 });
      pressRotation.value = withSpring(-0.5, { damping: 20, stiffness: 400 });
      chevronTranslate.value = withSpring(2, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(CARD_REST_SCALE, CARD_PRESS_SPRING_CONFIG);
    if (!reducedMotion) {
      shadowElevation.value = withTiming(3, { duration: 150 });
      pressRotation.value = withSpring(0, { damping: 15, stiffness: 300 });
      chevronTranslate.value = withSpring(0, { damping: 15, stiffness: 300 });
    }
  };

  const handlePress = () => {
    triggerHaptic('tap');
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
    if (__DEV__)
      console.warn('[IMPORT] createImportHandler fired', {
        hasOnImport: !!onImport,
        isImported,
        isImporting,
      });
    if (isImporting || isImported || !onImport) return;
    triggerHaptic('toggle');
    onImport();
  };
}
