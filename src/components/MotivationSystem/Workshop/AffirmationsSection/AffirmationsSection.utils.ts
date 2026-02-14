/**
 * Utility functions for AffirmationsSection
 * Helpers for affirmation display and random selection
 */

import type {
  AffirmationData,
  AffirmationType,
} from './AffirmationsSection.types';

/**
 * Format time for display (12-hour with AM/PM)
 */
export function formatTimeForDisplay(time?: string): string {
  if (!time) return '';
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const safeHours = Number.isNaN(hours) ? 0 : hours;
  const safeMinutes = Number.isNaN(minutes) ? 0 : minutes;
  const period = safeHours >= 12 ? 'PM' : 'AM';
  const displayHours = safeHours % 12 || 12;
  return `${displayHours}:${safeMinutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Helper function to get a random affirmation from a list
 * Used in Activation modal to show a random daily affirmation
 */
export function getRandomAffirmation(
  affirmations: AffirmationData[]
): AffirmationData | null {
  if (affirmations.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * affirmations.length);
  return affirmations[randomIndex];
}

/**
 * Helper function to get a random affirmation of a specific type
 * Useful for showing identity-based affirmations in specific contexts
 */
export function getRandomAffirmationByType(
  affirmations: AffirmationData[],
  type: AffirmationType
): AffirmationData | null {
  const filtered = affirmations.filter((a) => a.type === type);
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
