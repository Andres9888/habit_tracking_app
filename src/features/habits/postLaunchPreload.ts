/**
 * Post-launch preload for secondary app surfaces.
 *
 * Goal: keep the first Habits screen paint fast, then warm the
 * paywall/settings/templates code paths in the background so opening
 * them later does not incur first-load delay.
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';

import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';

let preloadPromise: Promise<void> | null = null;

function shouldSkipPreload(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

// React tree warm mounts are scheduled separately and intentionally still run
// in Expo Go, where this module preload is unavailable.

export function preloadPostLaunchAppParts(): Promise<void> {
  if (shouldSkipPreload()) {
    return Promise.resolve();
  }

  if (preloadPromise) return preloadPromise;

  preloadPromise = Promise.allSettled([
    import('../../components/CreateHabitModal'),
    import('../../components/RevenueCatPaywall'),
    import('../../components/SettingsModal'),
    import('../../screens/TemplatesScreen'),
    import('./components/HabitsModals/CreateHabitModalSection'),
    import('./components/HabitsModals/SettingsModalSection'),
    import('./components/HabitsModals/TemplatesModalSection'),
  ]).then(() => {});

  return preloadPromise;
}

export function schedulePostLaunchAppPreload(): () => void {
  if (shouldSkipPreload()) {
    return () => {};
  }

  let cancelled = false;

  const cancelScheduledPreload = scheduleWhenIdle(
    () => {
      if (cancelled) {
        return;
      }

      void preloadPostLaunchAppParts();
    },
    {
      fallbackDelayMs: 1200,
      timeoutMs: 3000,
    }
  );

  return () => {
    cancelled = true;
    cancelScheduledPreload();
  };
}
