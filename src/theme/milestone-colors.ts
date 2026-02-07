/**
 * Milestone & Badge Colors
 * Used by StreakIndicator for achievement milestones.
 *
 * Extracted from StreakIndicator.constants.ts to centralize
 * color definitions in the theme system.
 */

export const milestoneColors = {
  amber: '#F59E0B',
  amber800: '#92400e', // Dark amber for best streak text
  amberBorder: '#FCD34D',
  amberDark: '#78350F',
  amberLight: '#FEF9C3',
  amberText: '#A16207',
  stone: '#A8A29E',
  stone100: '#f5f5f4', // Light stone for unachieved badge bg
  stone600: '#57534e', // Medium stone for streak labels
  stone900: '#1c1917', // Dark stone for streak numbers
  violet: '#8B5CF6',
  yellow: '#EAB308',
} as const;

export type MilestoneColorKey = keyof typeof milestoneColors;
