/**
 * Post-launch preload for secondary app surfaces.
 *
 * Goal: keep the first Habits screen paint fast, then warm the
 * paywall/settings/templates code paths in the background so opening
 * them later does not incur first-load delay.
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';

import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';

const SECONDARY_PRELOAD_DELAY_MS = 2500;
const noop = () => {};
let frequentPreloadPromise: Promise<void> | null = null;
let secondaryPreloadPromise: Promise<void> | null = null;

function shouldSkipPreload(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

export function preloadFrequentAppParts(): Promise<void> {
  if (shouldSkipPreload()) {
    return Promise.resolve();
  }

  if (frequentPreloadPromise) return frequentPreloadPromise;

  frequentPreloadPromise = Promise.allSettled([
    import('./components/HabitsAppOverlays'),
    import('../../components/CreateHabitModal'),
    import('../../components/QuickActionsSheet'),
    import('./components/HabitsModals/CalendarAndDetailModals'),
    import('./components/HabitsModals/CreateHabitModalSection'),
    import('./components/HabitsModals/QuickActionsSection'),
  ]).then(() => {});

  return frequentPreloadPromise;
}

export function preloadSecondaryAppParts(): Promise<void> {
  if (shouldSkipPreload()) {
    return Promise.resolve();
  }

  if (secondaryPreloadPromise) return secondaryPreloadPromise;

  secondaryPreloadPromise = Promise.allSettled([
    import('../../components/RevenueCatPaywall'),
    import('../../components/SettingsModal'),
    import('../../screens/TemplatesScreen'),
    import('./components/HabitsModals/SettingsModalSection'),
    import('./components/HabitsModals/ShareAndPauseModals'),
    import('./components/HabitsModals/TemplatesModalSection'),
    import('./components/HabitsModals/VisualizationModalSection'),
  ]).then(() => {});

  return secondaryPreloadPromise;
}

export async function preloadPostLaunchAppParts(): Promise<void> {
  await Promise.all([preloadFrequentAppParts(), preloadSecondaryAppParts()]);
}

export function schedulePostLaunchAppPreload(): () => void {
  if (shouldSkipPreload()) {
    return () => {};
  }

  let cancelled = false;
  let cancelSecondaryIdle = noop;

  const cancelFrequentIdle = scheduleWhenIdle(
    () => {
      if (!cancelled) void preloadFrequentAppParts();
    },
    {
      fallbackDelayMs: 400,
      timeoutMs: 1500,
    }
  );
  const secondaryTimer = setTimeout(() => {
    if (cancelled) return;
    cancelSecondaryIdle = scheduleWhenIdle(
      () => {
        if (!cancelled) void preloadSecondaryAppParts();
      },
      {
        fallbackDelayMs: 500,
        timeoutMs: 2000,
      }
    );
  }, SECONDARY_PRELOAD_DELAY_MS);

  return () => {
    cancelled = true;
    clearTimeout(secondaryTimer);
    cancelFrequentIdle();
    cancelSecondaryIdle();
  };
}
