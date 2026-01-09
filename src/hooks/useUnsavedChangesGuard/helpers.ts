/**
 * Helper functions for useUnsavedChangesGuard hook
 */

/**
 * Normalize values for comparison (trim whitespace, handle nullish)
 */
export function normalizeValue(value: string | null | undefined): string {
  return (value ?? '').trim();
}

/**
 * Check if two values are meaningfully different
 */
export function hasChanges(current: string, original: string): boolean {
  return normalizeValue(current) !== normalizeValue(original);
}
