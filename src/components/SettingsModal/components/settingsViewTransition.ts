/**
 * settingsViewTransition — the one value behind the Settings sub-page slide.
 *
 * 0 = page at rest, -SCREEN_WIDTH = parked off the leading edge (back),
 * +SCREEN_WIDTH = parked off the trailing edge (forward).
 *
 * A shared value rather than a Reanimated layout animation (`entering`): the
 * whole Settings tree re-mounts on back-navigation, and the native layout
 * proxy passes those layout updates through *without* retargeting the in-flight
 * entering animation, which left the root page frozen ~30pt to the left. A
 * `withTiming` on a shared value runs on the UI thread, so no React re-commit
 * can strand it.
 *
 * Module-level for the same reason as detailPushProgress: only one Settings
 * modal is ever open, so a shared mutable beats threading a value through.
 */

import { useEffect } from 'react';
import {
  makeMutable,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { SCREEN_WIDTH } from '@/components/Modal/Modal.constants';
import { durations, enterEasing } from '@/theme/animations';

export type SettingsView = 'settings' | 'archived' | 'account' | 'calendar';
export type ViewDirection = 'forward' | 'back' | 'none';

/** Horizontal offset of the active Settings page, in px. */
export const settingsViewOffset = makeMutable(0);

const ENTER = { duration: durations.enter, easing: enterEasing };

/**
 * Park the incoming page on the edge it slides in from. Called before the
 * state commit that mounts the page so the first frame is already off-screen.
 */
export function parkSettingsView(direction: ViewDirection) {
  if (direction === 'back') {
    settingsViewOffset.value = -SCREEN_WIDTH;
    return;
  }
  settingsViewOffset.value = direction === 'forward' ? SCREEN_WIDTH : 0;
}

/** Animated style for the persistent page container; settles the parked offset. */
export function useSettingsViewTransition(
  view: SettingsView,
  reduceMotion: boolean
) {
  useEffect(() => {
    settingsViewOffset.value = withTiming(0, ENTER);
  }, [view]);

  // Branch inside the worklet — conditionally detaching the style strands the
  // last committed transform (repo gotcha).
  return useAnimatedStyle(() => {
    const offset = settingsViewOffset.value;
    if (reduceMotion) {
      return {
        opacity: 1 - Math.abs(offset) / SCREEN_WIDTH,
        transform: [{ translateX: 0 }],
      };
    }
    return { opacity: 1, transform: [{ translateX: offset }] };
  });
}
