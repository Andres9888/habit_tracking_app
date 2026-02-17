/**
 * StreakHeatmap Styles
 *
 * Color intensity scales for light and dark modes.
 * Follows the design system: 16px border radius, 4px shadow offset.
 */

import { StyleSheet } from 'react-native';

/** Cell size and gap for the contribution graph */
export const CELL_SIZE = 14;
export const CELL_GAP = 3;
export const CELL_RADIUS = 3;

/**
 * Get intensity color scale based on habit color.
 * Returns 5 levels (0-4) from empty to fully saturated.
 */
export function getIntensityColors(
  habitColor: string,
  isDark: boolean
): string[] {
  // Parse hex to RGB
  const hex = habitColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (isDark) {
    return [
      'rgba(255, 255, 255, 0.04)', // Level 0 — empty
      `rgba(${r}, ${g}, ${b}, 0.25)`, // Level 1 — sporadic
      `rgba(${r}, ${g}, ${b}, 0.45)`, // Level 2 — moderate
      `rgba(${r}, ${g}, ${b}, 0.70)`, // Level 3 — consistent
      `rgba(${r}, ${g}, ${b}, 1.0)`,  // Level 4 — perfect
    ];
  }

  return [
    'rgba(0, 0, 0, 0.04)',           // Level 0 — empty
    `rgba(${r}, ${g}, ${b}, 0.15)`,  // Level 1 — sporadic
    `rgba(${r}, ${g}, ${b}, 0.35)`,  // Level 2 — moderate
    `rgba(${r}, ${g}, ${b}, 0.60)`,  // Level 3 — consistent
    `rgba(${r}, ${g}, ${b}, 0.90)`,  // Level 4 — perfect
  ];
}

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  weekColumn: {
    flexDirection: 'column',
    gap: CELL_GAP,
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_RADIUS,
  },
  todayCell: {
    borderWidth: 1.5,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  legendLabel: {
    fontSize: 11,
    marginRight: 4,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  monthLabels: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 0,
  },
  monthLabel: {
    fontSize: 11,
  },
});
