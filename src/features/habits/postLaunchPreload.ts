/**
 * Post-launch preload for secondary app surfaces.
 *
 * Goal: keep the first Habits screen paint fast, then warm the
 * paywall/settings/templates code paths in the background so opening
 * them later does not incur first-load delay.
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';

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

  let timer: ReturnType<typeof setTimeout> | null = null;
  let idleHandle: number | null = null;
  let cancelled = false;

  const runPreload = (): void => {
    if (cancelled) return;
    void preloadPostLaunchAppParts();
  };

  if (typeof requestIdleCallback === 'function') {
    idleHandle = requestIdleCallback(runPreload, { timeout: 1500 });
  } else {
    timer = setTimeout(runPreload, 120);
  }

  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
    if (idleHandle !== null && typeof cancelIdleCallback === 'function') {
      cancelIdleCallback(idleHandle);
    }
  };
}
