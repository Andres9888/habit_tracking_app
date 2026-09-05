/**
 * Displayed-streak resolution.
 *
 * The home list counts streaks client-side so a toggle updates instantly, but
 * it only ever holds the tracking rows inside the fetched window (today−90d by
 * default). Two situations make that client count wrong:
 *
 *   1. The run reaches the first day of the window — the real streak may extend
 *      further back than we fetched, so the client value is a floor, not a fact.
 *   2. The habit was paused inside the window — pauses don't break a streak
 *      server-side, but the client only sees missing tracking rows.
 *
 * In both cases we fall back to `max(client, server)`: the server value is
 * pause-aware and computed over a 400-day window, while the client value stays
 * authoritative for optimistic changes the server hasn't seen yet.
 */

import { getLocalDateString } from '@/utils/getLocalDateString';
import type { CurrentStreakRun } from '@/utils/streak';

/** The server-computed streak fields we cross-check the client count against. */
export interface ServerStreakInfo {
  currentStreak?: number;
  pausedAt?: number;
}

function runTouchesWindowStart(
  run: CurrentStreakRun | undefined,
  windowStart: string
): boolean {
  if (!run?.earliestDate || !windowStart) return false;
  return run.earliestDate <= windowStart;
}

function pausedInsideWindow(
  pausedAt: number | undefined,
  windowStart: string
): boolean {
  if (pausedAt === undefined || !windowStart) return false;
  const pausedDate = new Date(pausedAt);
  if (Number.isNaN(pausedDate.getTime())) return false;
  return getLocalDateString(pausedDate) >= windowStart;
}

/**
 * Resolve the streak to display for one habit.
 *
 * @param run - Client-computed streak run (count + earliest counted day)
 * @param serverInfo - Server `currentStreak` / `pausedAt` for the same habit
 * @param windowStart - First day (YYYY-MM-DD) of the fetched tracking window
 */
export function resolveDisplayedStreak(
  run: CurrentStreakRun | undefined,
  serverInfo: ServerStreakInfo | undefined,
  windowStart: string
): number {
  const clientStreak = run?.streak ?? 0;
  const truncated = runTouchesWindowStart(run, windowStart);
  const pauseUnaccounted = pausedInsideWindow(serverInfo?.pausedAt, windowStart);
  if (!truncated && !pauseUnaccounted) return clientStreak;
  return Math.max(clientStreak, serverInfo?.currentStreak ?? 0);
}

/** Resolve every habit's displayed streak into a lookup map. */
export function buildResolvedStreakByHabit(
  runByHabit: Map<string, CurrentStreakRun>,
  serverInfoByHabit: Map<string, ServerStreakInfo>,
  windowStart: string
): Map<string, number> {
  const resolved = new Map<string, number>();
  for (const [habitId, run] of runByHabit) {
    resolved.set(
      habitId,
      resolveDisplayedStreak(run, serverInfoByHabit.get(habitId), windowStart)
    );
  }
  // A paused habit can have no tracking rows at all inside the window, so it
  // never shows up in runByHabit — resolve those from the server value alone.
  for (const [habitId, serverInfo] of serverInfoByHabit) {
    if (resolved.has(habitId)) continue;
    resolved.set(
      habitId,
      resolveDisplayedStreak(undefined, serverInfo, windowStart)
    );
  }
  return resolved;
}
