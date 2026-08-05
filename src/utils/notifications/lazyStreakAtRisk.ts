/** Lazy-loaded streak-at-risk notification wrappers to avoid eager expo-notifications import. */

export async function scheduleStreakAtRiskNotification(
  ...args: Parameters<
    typeof import('./streakAtRisk').scheduleStreakAtRiskNotification
  >
): ReturnType<
  typeof import('./streakAtRisk').scheduleStreakAtRiskNotification
> {
  const mod = await import('./streakAtRisk');
  return mod.scheduleStreakAtRiskNotification(...args);
}

export async function cancelStreakAtRiskNotification(
  ...args: Parameters<
    typeof import('./streakAtRisk').cancelStreakAtRiskNotification
  >
): ReturnType<typeof import('./streakAtRisk').cancelStreakAtRiskNotification> {
  const mod = await import('./streakAtRisk');
  return mod.cancelStreakAtRiskNotification(...args);
}

export async function cancelAllStreakAtRiskNotifications(
  ...args: Parameters<
    typeof import('./streakAtRisk').cancelAllStreakAtRiskNotifications
  >
): ReturnType<
  typeof import('./streakAtRisk').cancelAllStreakAtRiskNotifications
> {
  const mod = await import('./streakAtRisk');
  return mod.cancelAllStreakAtRiskNotifications(...args);
}
