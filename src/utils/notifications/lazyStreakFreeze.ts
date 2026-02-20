/** Lazy-loaded streak-freeze notification wrappers to avoid eager expo-notifications import. */

export async function scheduleStreakFreezeNotification(
  ...args: Parameters<
    typeof import('./streakFreeze').scheduleStreakFreezeNotification
  >
): ReturnType<
  typeof import('./streakFreeze').scheduleStreakFreezeNotification
> {
  const mod = await import('./streakFreeze');
  return mod.scheduleStreakFreezeNotification(...args);
}

export async function cancelStreakFreezeNotification(
  ...args: Parameters<
    typeof import('./streakFreeze').cancelStreakFreezeNotification
  >
): ReturnType<typeof import('./streakFreeze').cancelStreakFreezeNotification> {
  const mod = await import('./streakFreeze');
  return mod.cancelStreakFreezeNotification(...args);
}

export async function cancelAllStreakFreezeNotifications(
  ...args: Parameters<
    typeof import('./streakFreeze').cancelAllStreakFreezeNotifications
  >
): ReturnType<
  typeof import('./streakFreeze').cancelAllStreakFreezeNotifications
> {
  const mod = await import('./streakFreeze');
  return mod.cancelAllStreakFreezeNotifications(...args);
}
