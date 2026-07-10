/**
 * Chain-link correctness rules, shared by the circle (ChainDayBody) and
 * square (CalendarDayBody) cell renderers so both use one definition.
 */
import type { DayData } from './types';

/** A day whose right-edge fuse can visually connect. Mirrors the same rule
 *  ChainConnectors.tsx already uses for the square ribbon overlay. */
export function isLinkable(day: DayData | undefined): boolean {
  return Boolean(day?.isCompleted && day?.isCurrentMonth && !day?.isFuture);
}

/**
 * CRITICAL correctness rule: a link only fuses to its RIGHT neighbor when
 * BOTH days are completed AND the current cell is not the last column of
 * its week row — otherwise the connector leaks across the week wrap.
 */
export function shouldJoinRight(week: DayData[], index: number): boolean {
  return (
    isLinkable(week[index]) &&
    isLinkable(week[index + 1]) &&
    index < week.length - 1
  );
}

/** Fixed strength value passed to the reused DayConnector component for the
 *  "small" connector style — deliberately NOT wired to the habit's real
 *  strength. 25 resolves to the neutral 'chain' material tier (accent
 *  color, 3px, no shimmer/glow), giving a plain thin line regardless of
 *  the habit's actual gamified strength. */
export const SMALL_CONNECTOR_STRENGTH = 25;
