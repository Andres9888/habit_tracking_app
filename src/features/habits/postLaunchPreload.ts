/**
 * Post-launch preload for secondary app surfaces.
 *
 * Keep the create and paywall paths warm without pulling the hidden Settings
 * and Templates trees into the home-screen startup window.
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';

import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';

let preloadPromise: Promise<void> | null = null;

function shouldSkipPreload(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

export function preloadPostLaunchAppParts(): Promise<void> {
  if (shouldSkipPreload()) {
    return Promise.resolve();
  }

  if (preloadPromise) return preloadPromise;

  preloadPromise = Promise.allSettled([
    import('../../components/CreateHabitModal'),
    import('../../components/RevenueCatPaywall'),
    import('./components/HabitsModals/CreateHabitModalSection'),
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
      fallbackDelayMs: 120,
      timeoutMs: 1500,
    }
  );

  return () => {
    cancelled = true;
    cancelScheduledPreload();
  };
}
