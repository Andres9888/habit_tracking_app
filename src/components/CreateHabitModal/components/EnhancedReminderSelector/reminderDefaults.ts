/**
 * Default-time helpers for the reminder toggle.
 *
 * The form seeds reminderTime with getDefaultReminderTime() (a hardcoded
 * fallback the user never chose). When reminders are first enabled we snap
 * that untouched default to the preset nearest the current time, so the
 * selected state always has a visible origin in the preset row.
 */

import { getDefaultReminderTime } from '../../../../utils/notifications';
import type { ReminderPreset } from './types';

const MINUTES_PER_DAY = 24 * 60;

/** True when the time still equals the seeded fallback (user never picked). */
export function isUntouchedDefaultTime(time: Date): boolean {
  const fallback = getDefaultReminderTime();
  return (
    time.getHours() === fallback.getHours() &&
    time.getMinutes() === fallback.getMinutes()
  );
}

/** Circular distance in minutes between two times of day. */
function clockDistance(aMinutes: number, bMinutes: number): number {
  const diff = Math.abs(aMinutes - bMinutes);
  return Math.min(diff, MINUTES_PER_DAY - diff);
}

/** Returns the preset time-of-day closest to `now` (circular clock distance). */
export function getNearestPresetTime(
  presets: ReminderPreset[],
  now: Date = new Date()
): Date {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let nearest = presets[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const preset of presets) {
    const distance = clockDistance(nowMinutes, preset.hour * 60 + preset.minute);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = preset;
    }
  }

  const time = new Date(now);
  time.setHours(nearest.hour, nearest.minute, 0, 0);
  return time;
}
