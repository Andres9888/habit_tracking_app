/**
 * useTemplateCardHandlers Hook
 *
 * Press event handlers for TemplateCard
 */

import { withTiming } from 'react-native-reanimated';
import {
  CARD_PRESS_SCALE,
  CARD_PRESS_SPRING_CONFIG,
  CARD_REST_SCALE,
  pressCard,
  releaseCard,
} from '../../../utils/animations/cardPressAnimation';

export function useTemplateCardHandlers(
  pressScale: { value: number },
  shadowOpacity: { value: number }
) {
  const handlePressIn = () => {
    pressCard(pressScale);
    shadowOpacity.value = withTiming(0.12, { duration: 120 });
  };

  const handlePressOut = () => {
    releaseCard(pressScale);
    shadowOpacity.value = withTiming(0.06, { duration: 200 });
  };

  return { handlePressIn, handlePressOut };
}
