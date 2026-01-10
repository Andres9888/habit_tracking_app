/**
 * useExitAnimationValues - Shared values for exit animation
 */

import { useSharedValue } from 'react-native-reanimated';

export function useExitAnimationValues() {
  const iconTranslateY = useSharedValue(0);
  const iconExitScale = useSharedValue(1);
  const containerOpacity = useSharedValue(1);
  const ringOpacity = useSharedValue(1);
  const burstOpacity = useSharedValue(1);

  return {
    burstOpacity,
    containerOpacity,
    iconExitScale,
    iconTranslateY,
    ringOpacity,
  };
}
