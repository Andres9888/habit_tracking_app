/** The four named slices of the day, plus hour → slice lookup. Data only. */

import type { Daypart } from './types';

export const DAYPARTS: Daypart[] = [
  {
    endHour: 9,
    key: 'early',
    label: 'Early morning',
    phrase: 'before 9 AM',
    startHour: 0,
  },
  {
    endHour: 12,
    key: 'morning',
    label: 'Late morning',
    phrase: 'mid-morning',
    startHour: 9,
  },
  {
    endHour: 17,
    key: 'afternoon',
    label: 'Afternoon',
    phrase: 'in the afternoon',
    startHour: 12,
  },
  {
    endHour: 24,
    key: 'evening',
    label: 'Evening',
    phrase: 'in the evening',
    startHour: 17,
  },
];

export function daypartForHour(hour: number): Daypart {
  return (
    DAYPARTS.find((part) => hour >= part.startHour && hour < part.endHour) ??
    DAYPARTS[DAYPARTS.length - 1]!
  );
}
