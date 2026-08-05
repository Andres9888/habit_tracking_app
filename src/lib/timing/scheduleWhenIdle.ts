interface ScheduleWhenIdleOptions {
  fallbackDelayMs: number;
  timeoutMs?: number;
}

export function scheduleWhenIdle(
  task: () => void,
  { fallbackDelayMs, timeoutMs }: ScheduleWhenIdleOptions
): () => void {
  if (typeof globalThis.requestIdleCallback === 'function') {
    const handle = globalThis.requestIdleCallback(
      task,
      timeoutMs === undefined ? undefined : { timeout: timeoutMs }
    );

    return () => {
      globalThis.cancelIdleCallback?.(handle);
    };
  }

  const timer = globalThis.setTimeout(task, fallbackDelayMs);

  return () => {
    globalThis.clearTimeout(timer);
  };
}
