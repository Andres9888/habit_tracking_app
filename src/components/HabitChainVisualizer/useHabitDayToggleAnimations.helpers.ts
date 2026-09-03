import { cancelAnimation, type SharedValue } from 'react-native-reanimated';

interface Values {
  buttonScale: SharedValue<number>;
}

/**
 * Drop any in-flight press choreography and park the cell at rest. Used when a
 * position-keyed slot is reused for another date and when reduced motion turns
 * on mid-press, so a scale value can never strand at 0.97.
 */
export function snapDayToggleAnimations(values: Values) {
  cancelAnimation(values.buttonScale);
  values.buttonScale.value = 1;
}
