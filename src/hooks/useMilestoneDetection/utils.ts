/**
 * Milestone Detection Utilities
 */

/**
 * Milestone thresholds (based on UX spec Section 8.2)
 * Trigger celebration when crossing these boundaries
 */
export const MILESTONE_THRESHOLDS = [20, 40, 60, 80] as const;

/**
 * Check if a milestone was crossed between two strength values
 */
export function checkMilestoneCrossed(
  previousStrength: number,
  currentStrength: number
): boolean {
  // Only trigger on upward movement
  if (currentStrength <= previousStrength) {
    return false;
  }

  // Check if any threshold was crossed
  return MILESTONE_THRESHOLDS.some(
    (threshold) => previousStrength < threshold && currentStrength >= threshold
  );
}
