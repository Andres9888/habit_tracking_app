/**
 * Per-completion effort estimate validation.
 *
 * Extracted from validation.ts to keep that module within the 100-line cap.
 */

const MIN_EFFORT_MINUTES = 1;
const MAX_EFFORT_MINUTES = 480;

/**
 * Validate a per-completion effort estimate.
 *
 * The first UI exposes 5/15/30-minute presets, while the wider integer range
 * keeps the stored field compatible with a later custom-duration control.
 */
export function validateEffortMinutes(
  effortMinutes: number | null | undefined
): void {
  if (effortMinutes == null) return;
  if (
    !Number.isInteger(effortMinutes) ||
    effortMinutes < MIN_EFFORT_MINUTES ||
    effortMinutes > MAX_EFFORT_MINUTES
  ) {
    throw new Error(
      `effortMinutes must be an integer between ${MIN_EFFORT_MINUTES} and ${MAX_EFFORT_MINUTES}`
    );
  }
}
