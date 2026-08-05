/**
 * Determine tip type from tip text
 * Parses the actionable tip message to determine which quick actions to show
 */

import type { TipType } from './types';

export function determineTipTypeFromText(
  tipText: string,
  currentStreak: number
): { tipType: TipType; focusDayName?: string } {
  // Focus day pattern: "Focus on X & Y to level up!" or "Focus on X to level up!"
  const focusDayMatch = tipText.match(
    /Focus on ([A-Za-z]+(?:\s*&\s*[A-Za-z]+)?)/i
  );
  if (focusDayMatch) {
    // Extract first day name if multiple (e.g., "Sat & Sun" -> "Sat")
    const dayPart = focusDayMatch[1].split('&')[0].trim();
    return { focusDayName: dayPart, tipType: 'focusDay' };
  }

  // Good streak pattern: "Amazing streak!" or similar
  if (
    tipText.toLowerCase().includes('amazing streak') ||
    tipText.toLowerCase().includes('keep the momentum')
  ) {
    return { tipType: 'goodStreak' };
  }

  // Week streak pattern: "more days to hit a week streak"
  if (tipText.toLowerCase().includes('week streak')) {
    return { tipType: 'weekStreak' };
  }

  // Low/no streak pattern: "Complete today to start"
  if (
    tipText.toLowerCase().includes('complete today') ||
    tipText.toLowerCase().includes('start a new streak')
  ) {
    return { tipType: currentStreak > 0 ? 'lowStreak' : 'noData' };
  }

  // Default to low streak if there's any tip but no streak
  if (currentStreak === 0) {
    return { tipType: 'noData' };
  }

  return { tipType: 'lowStreak' };
}
