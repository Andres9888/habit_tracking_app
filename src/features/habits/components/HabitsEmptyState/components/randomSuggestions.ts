export const MAX_SUGGESTIONS = 4;

export function pickRandomHabits<T>(habits: T[], count: number): T[] {
  const pool = [...habits];
  const limit = Math.min(count, pool.length);

  for (let i = 0; i < limit; i += 1) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, limit);
}
