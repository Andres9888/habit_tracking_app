type Timer = ReturnType<typeof setTimeout>;

export function createOperationTimers() {
  const timers = new Map<string, Timer[]>();

  const remove = (operationId: string, timer: Timer): void => {
    const active = timers.get(operationId)?.filter((item) => item !== timer);
    if (active?.length) {
      timers.set(operationId, active);
    } else {
      timers.delete(operationId);
    }
  };

  return {
    clear(operationId?: string): void {
      const entries = operationId
        ? [[operationId, timers.get(operationId) ?? []] as const]
        : [...timers.entries()];
      for (const [id, active] of entries) {
        for (const timer of active) clearTimeout(timer);
        timers.delete(id);
      }
    },

    schedule(operationId: string, callback: () => void, delayMs: number): void {
      const timer = setTimeout(() => {
        remove(operationId, timer);
        callback();
      }, delayMs);
      timers.set(operationId, [...(timers.get(operationId) ?? []), timer]);
    },
  };
}
