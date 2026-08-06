/**
 * Automaticity meta for the hero pill — ONE source of truth for "how long
 * until this is automatic" on the detail page.
 *
 * The hero pill used to print `growthType` days (simple 30 / average 66 /
 * complex 120) while the timeline's `peak` node printed its own per-habit
 * estimate. Across the authored library those disagreed on 142 of 262
 * templates — "Average · ~66d" in the hero, "~30 days · Automatic" in the
 * timeline, both visible within a screen and a half. A page whose whole
 * positioning is rigor cannot state two automaticity numbers for one habit.
 *
 * The authored timeline wins where it exists: it is written per-habit, whereas
 * `growthType` is a coarse three-bucket default. `growthType` remains the
 * fallback for templates with no timeline, and is untouched elsewhere — it
 * still drives the post-add strength model.
 *
 * The label is derived from the resolved day count rather than read off
 * `growthType`, so the pill can never read "Complex · ~30d".
 */

import type { Template } from '../../../types/template';
import type { TimelineEntry } from '../../../../convex/templates/types';

export interface AutomaticityMeta {
  label: string;
  days: number;
}

const GROWTH_DAYS: Record<string, number> = {
  simple: 30,
  average: 66,
  complex: 120,
};

/** Bucket boundaries chosen so the stock growth days keep their old labels. */
function labelFor(days: number): string {
  if (days <= 45) return 'Simple';
  if (days <= 90) return 'Average';
  return 'Complex';
}

/**
 * Parse an authored `when` string into days. Handles the shapes the enrichment
 * data actually uses: "~30 days", "Day 21", "Week 6", "Month 3", "Days 1-4".
 * Returns null for anything unrecognised so we fall back rather than guess.
 */
export function parseWhenToDays(when: string | undefined): number | null {
  if (!when) return null;
  // Ranges ("Days 1-4", "Week 2-3") describe a span, not a milestone — take the
  // upper bound, which is when the described state has actually arrived.
  const numbers = when.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  const value = Number(numbers[numbers.length - 1]);
  if (!Number.isFinite(value) || value <= 0) return null;

  if (/month/i.test(when)) return value * 30;
  if (/week/i.test(when)) return value * 7;
  if (/day|night|session/i.test(when)) return value;
  return null;
}

/** Days to automaticity from the timeline's peak node, when it parses. */
export function peakDays(timeline: TimelineEntry[] | undefined): number | null {
  if (!timeline || timeline.length === 0) return null;
  const peak = [...timeline].reverse().find((node) => node.peak);
  return parseWhenToDays(peak?.when);
}

export function getAutomaticityMeta(
  template: Template | null | undefined
): AutomaticityMeta | null {
  const fromTimeline = peakDays(template?.timeline);
  const days = fromTimeline ?? GROWTH_DAYS[template?.growthType ?? ''] ?? null;
  if (days === null) return null;
  return { days, label: labelFor(days) };
}
