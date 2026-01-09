/**
 * WOOP Utility Functions
 */

import type { WOOPData } from './WOOPSection.types';

/** Checks if the WOOP data has at least one field filled */
export function hasWOOPData(woop: WOOPData | undefined): boolean {
  if (!woop) return false;
  return !!(woop.wish || woop.outcome || woop.obstacle || woop.plan);
}

/** Checks if the WOOP data is complete (all 4 fields filled) */
export function isWOOPComplete(woop: WOOPData | undefined): boolean {
  if (!woop) return false;
  return !!(woop.wish && woop.outcome && woop.obstacle && woop.plan);
}

/** Formats the IF-THEN implementation intention preview */
export function formatIfThen(woop: WOOPData): string | null {
  if (!woop.obstacle || !woop.plan) return null;
  return `If ${woop.obstacle.toLowerCase()} → ${woop.plan.toLowerCase()}`;
}
