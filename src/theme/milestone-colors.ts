/**
 * Milestone & Badge Colors
 * Used by StreakIndicator for achievement milestones.
 *
 * Extracted from StreakIndicator.constants.ts to centralize
 * color definitions in the theme system.
 */

export const milestoneColors = {
  amber: '#F59E0B',
  amberBorder: '#FCD34D',
  amberDark: '#78350F',
  amberLight: '#FEF9C3',
  amberText: '#A16207',
  stone: '#A8A29E',
  violet: '#8B5CF6',
  yellow: '#EAB308',
} as const;

export type MilestoneColorKey = keyof typeof milestoneColors;
