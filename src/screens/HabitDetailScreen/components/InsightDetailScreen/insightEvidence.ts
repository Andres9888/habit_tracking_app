/** Honest copy for Insight Detail — counts from the log, never a sample lie. */

import type { OneFixInsight, WorkingInsight } from '../../insights';
import { oneFixStackHint } from '../NoticingSection/oneFixCopy';

export const INSIGHT_FOOTNOTE =
  'This is a pattern in what you logged. It doesn’t explain why, and it isn’t a prediction.';

export const INSIGHT_EMPTY = 'Nothing to show for this insight yet.';

export function workingHeadline(insight: WorkingInsight): string {
  return `Check-ins land ${insight.daypart.phrase}.`;
}

export function workingProse(insight: WorkingInsight): string {
  return `Of ${insight.sample} timestamped check-ins, ${insight.sharePct}% landed ${insight.daypart.phrase} and ${insight.otherPct}% landed in the rest of the day. That describes what you logged — it does not explain why.`;
}

export function workingNextStep(insight: WorkingInsight): string | null {
  const window = insight.daypart.label.toLowerCase();
  if (!insight.reminderTime) {
    return `If you want a reminder, one just before your ${window} window would protect it. Optional.`;
  }
  if (insight.reminderInWindow) return null;
  return `Reminder at ${insight.reminderTime} sits outside your best window. You could move it. Optional.`;
}

export function oneFixHeadline(insight: OneFixInsight): string {
  return `${insight.weakest.plural} are where it slips.`;
}

export function oneFixProse(insight: OneFixInsight): string {
  const { done, scheduled, plural } = insight.weakest;
  return `You logged ${done} of ${scheduled} ${plural.toLowerCase()}. That is a gap in the record. It describes what you logged — it does not explain why.`;
}

export function oneFixNextStep(insight: OneFixInsight, cue?: string): string {
  return `${oneFixStackHint(insight, cue)} Optional.`;
}
