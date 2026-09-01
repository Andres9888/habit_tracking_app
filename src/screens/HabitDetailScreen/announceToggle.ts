/**
 * VoiceOver announcement for a day toggle.
 *
 * Split out of `useCalendarHandlers` to keep that hook inside the 100-line
 * ceiling. The delay lets the screen reader finish whatever the tap itself
 * queued before the state change is read out.
 */

import { AccessibilityInfo } from 'react-native';
import { parseDateKeyLocal } from '../../utils/getLocalDateString';

const ANNOUNCE_DELAY_MS = 200;

export function toggleAnnouncement(
  habitName: string,
  date: string,
  wasCompleted: boolean
): string {
  const dateFormatted = parseDateKeyLocal(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  });
  const newState = wasCompleted ? 'marked incomplete' : 'marked complete';
  return `${habitName} on ${dateFormatted} ${newState}.`;
}

export function announceToggle(
  habitName: string,
  date: string,
  wasCompleted: boolean
): void {
  const announcement = toggleAnnouncement(habitName, date, wasCompleted);
  if (__DEV__) console.log('A11y announcement:', announcement);
  setTimeout(() => {
    AccessibilityInfo.announceForAccessibility(announcement);
  }, ANNOUNCE_DELAY_MS);
}
