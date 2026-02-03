import type { CharacterData } from './types';

/**
 * Mock character data for development
 * TODO(feature): Connect to actual habit tracking data
 * - Calculate attributes based on habit completion patterns
 * - Derive level from total XP earned
 * - Pull recent achievements from milestone system
 */
export const MOCK_CHARACTER_DATA: CharacterData = {
  attributes: {
    energy: 41,
    strength: 34,
    vitality: 27,
    wisdom: 20,
  },
  level: 1,
  recentAchievements: [
    {
      description: 'Complete all habits for 7 days',
      icon: '🏆',
      id: '1',
      title: 'Week Warrior',
    },
  ],
  stats: {
    activeHabits: 3,
    dayStreak: 7,
    totalPower: 69,
  },
  title: 'Habit Hero',
  xp: 69,
  xpToNextLevel: 100,
};

export const ATTRIBUTE_CONFIGS = {
  vitality: {
    bgGradient: ['#ffe2e2', '#fdf2f8'] as const,
    gradientColors: ['#fb2c36', '#f6339a'] as const,
    iconColor: '#fb2c36',
  },
  strength: {
    bgGradient: ['#ffedd4', '#fffbeb'] as const,
    gradientColors: ['#ff6900', '#fe9a00'] as const,
    iconColor: '#ff6900',
  },
  wisdom: {
    bgGradient: ['#f3e8ff', '#eef2ff'] as const,
    gradientColors: ['#ad46ff', '#615fff'] as const,
    iconColor: '#ad46ff',
  },
  energy: {
    bgGradient: ['#fef9c2', '#fff7ed'] as const,
    gradientColors: ['#f0b100', '#ff6900'] as const,
    iconColor: '#f0b100',
  },
} as const;

export const AVATAR_GRADIENT = ['#ad46ff', '#f6339a'] as const;
export const XP_GRADIENT = ['#ad46ff', '#f6339a'] as const;
export const TROPHY_GRADIENT = ['#ff8c00', '#ff6900'] as const;
