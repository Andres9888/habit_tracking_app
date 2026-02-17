/**
 * MilestoneGallery Constants
 * Full trophy room milestone definitions (7, 14, 30, 60, 100, 365 days)
 */

export const GALLERY_MILESTONES = [
  {
    color: '#10b981',
    days: 7,
    description: '7-day streak',
    emoji: '🌱',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    gradientColors: ['#10b981', '#34d399'] as [string, string],
    title: 'First Week',
  },
  {
    color: '#3b82f6',
    days: 14,
    description: '14-day streak',
    emoji: '⚡',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    gradientColors: ['#3b82f6', '#60a5fa'] as [string, string],
    title: 'Two Weeks',
  },
  {
    color: '#f59e0b',
    days: 30,
    description: '30-day streak',
    emoji: '🏆',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    gradientColors: ['#f59e0b', '#fcd34d'] as [string, string],
    title: 'One Month',
  },
  {
    color: '#ef4444',
    days: 60,
    description: '60-day streak',
    emoji: '🔥',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    gradientColors: ['#ef4444', '#f87171'] as [string, string],
    title: 'Two Months',
  },
  {
    color: '#8b5cf6',
    days: 100,
    description: '100-day streak',
    emoji: '👑',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    gradientColors: ['#8b5cf6', '#a78bfa'] as [string, string],
    title: 'Century Club',
  },
  {
    color: '#ec4899',
    days: 365,
    description: '365-day streak',
    emoji: '🌟',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    gradientColors: ['#ec4899', '#f472b6'] as [string, string],
    title: 'Full Year',
  },
] as const;

export type GalleryMilestone = (typeof GALLERY_MILESTONES)[number];
export type GalleryMilestoneDays = (typeof GALLERY_MILESTONES)[number]['days'];

/** AsyncStorage key for gallery achievement records */
export const GALLERY_STORAGE_KEY = '@chain_day:milestone_gallery_achievements';

/** Milestone shown storage prefix (from StreakMilestoneCelebration) */
export const MILESTONE_SHOWN_PREFIX = '@chain_day:streak_milestones_shown:';

/** Animation constants */
export const GALLERY_ANIMATION = {
  CARD_STAGGER: 60,
  GLOW_DURATION: 1800,
  PULSE_DAMPING: 15,
  PULSE_STIFFNESS: 80,
  SPRING_DAMPING: 18,
  SPRING_STIFFNESS: 180,
} as const;
