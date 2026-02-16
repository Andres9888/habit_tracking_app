import { MAX_SUGGESTIONS } from '@/constants';

export { MAX_SUGGESTIONS };

export function pickRandomHabits<T>(habits: T[], count: number): T[] {
  const pool = [...habits];
  const limit = Math.min(count, pool.length);

  for (let i = 0; i < limit; i += 1) {
    // Fisher-Yates shuffle: swap current with random remaining element
    const swapIndex = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[swapIndex]] = [pool[swapIndex], pool[i]];
  }

  return pool.slice(0, limit);
}
