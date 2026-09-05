/**
 * detailPushProgress — the one value behind the habit detail push.
 *
 * 0 = detail fully off-screen, 1 = detail at rest. The detail page, its scrim
 * and the Home parallax all interpolate from this single value so they can
 * never drift apart (a scrim on its own curve lingers after the page is gone).
 *
 * Module-level on purpose: Home and the detail Modal live in different
 * subtrees (the Modal is its own native window) and only one detail screen is
 * ever open, so a shared mutable is simpler than threading a value through
 * the modal host.
 */

import { makeMutable, useAnimatedStyle, useReducedMotion } from 'react-native-reanimated';
import { SCREEN_WIDTH } from '@/components/Modal/Modal.constants';

export const detailPushProgress = makeMutable(0);

/** iOS pushes the outgoing screen about a third of the way behind the new one. */
const HOME_PARALLAX = 0.3;

/** Style for the Home root: slides left under the incoming detail page. */
export function useHomePushParallax() {
  const reduceMotion = useReducedMotion();
  return useAnimatedStyle(() => ({
    transform: [
      {
        translateX: reduceMotion
          ? 0
          : -detailPushProgress.value * SCREEN_WIDTH * HOME_PARALLAX,
      },
    ],
  }));
}
