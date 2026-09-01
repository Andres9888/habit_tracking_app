/**
 * Ladder marks for the streak-goal track — pure so the geometry and the copy
 * can be unit-tested without rendering.
 *
 * Four things can sit on the track: the first-week milestone, where you are
 * now, the record you have to clear, and the goal itself. Duplicates are
 * dropped so a run that has just tied its record does not stack two dots.
 */

export type LadderKind = 'past' | 'now' | 'record' | 'goal';

export interface LadderMark {
  /** 0–100, already clamped to the track. */
  leftPct: number;
  kind: LadderKind;
  label: string;
  value: number;
}

export function buildLadder(
  currentStreak: number,
  bestStreak: number,
  goal: number
): LadderMark[] {
  if (goal <= 0) return [];

  const marks: Omit<LadderMark, 'leftPct'>[] = [];
  if (goal > 7 && currentStreak !== 7 && bestStreak !== 7) {
    marks.push({ kind: 'past', label: '7', value: 7 });
  }
  marks.push({
    kind: 'now',
    label: currentStreak === 0 ? 'today' : String(currentStreak),
    value: currentStreak,
  });
  if (bestStreak < goal && bestStreak !== currentStreak) {
    marks.push({ kind: 'record', label: `${bestStreak}★`, value: bestStreak });
  }
  marks.push({ kind: 'goal', label: String(goal), value: goal });

  return marks
    .sort((a, b) => a.value - b.value)
    .map((mark) => ({
      ...mark,
      leftPct: Math.min(100, (mark.value / goal) * 100),
    }));
}
