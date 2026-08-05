/**
 * Heuristic filter helpers for preset chips (Quick / High ROI).
 *
 * estimatedMinutes exists in the schema but is currently unpopulated across
 * the seed templates, so isQuickTemplate falls back to a regex on
 * name + description. The regex caps minute words at "five" deliberately —
 * "15 minute intervals" / "25-minute" must NOT match.
 */

const QUICK_RX =
  /\b(?:[1-5]\s*[-–]?\s*minute|one\s+minute|two\s+minute|three\s+minute|four\s+minute|five\s+minute|30\s*sec|10\s*sec|15\s*sec|micro|quick|brief|tiny|moment)\b/i;

interface QuickCandidate {
  description?: string;
  estimatedMinutes?: number;
  name?: string;
}

export function isQuickTemplate(t: QuickCandidate): boolean {
  if (typeof t.estimatedMinutes === 'number') return t.estimatedMinutes <= 5;
  return QUICK_RX.test(`${t.name ?? ''} ${t.description ?? ''}`);
}

export const HIGH_ROI_THRESHOLD = 85;

interface HighRoiCandidate {
  popularityScore?: number;
  tips?: string[];
}

/**
 * "High ROI" = well-scored OR well-curated.
 *
 * Primary signal is popularityScore. The tips fallback keeps the filter
 * useful in deployments where popularityScore is unpopulated/stale —
 * a template with two or more curated tips is by definition a higher-impact
 * pick than a no-tips template at the same score.
 */
export function isHighRoiTemplate(t: HighRoiCandidate): boolean {
  if ((t.popularityScore ?? 0) >= HIGH_ROI_THRESHOLD) return true;
  return Array.isArray(t.tips) && t.tips.length >= 2;
}
