import type { CharacterData } from './types';

// Mock data - TODO: Connect to actual habit data
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
    {
      description: 'Completed your first habit',
      icon: '🌟',
      id: '2',
      title: 'First Step',
    },
    {
      description: 'Maintained a 3-day streak',
      icon: '🔥',
      id: '3',
      title: 'On Fire',
    },
  ],
  stats: {
    activeHabits: 3,
    dayStreak: 7,
    totalPower: 69,
  },
  title: 'Habit Hero',
  totalAchievements: 10,
  xp: 69,
  xpToNextLevel: 100,
};

export const ATTRIBUTE_CONFIGS = {
  energy: {
    bgGradient: ['#fef9c2', '#fff7ed'] as const,
    description: 'Gained from active habits',
    gradientColors: ['#f0b100', '#ff6900'] as const,
    iconColor: '#f0b100',
  },
  strength: {
    bgGradient: ['#ffedd4', '#fffbeb'] as const,
    description: 'Built through consistency',
    gradientColors: ['#ff6900', '#fe9a00'] as const,
    iconColor: '#ff6900',
  },
  vitality: {
    bgGradient: ['#ffe2e2', '#fdf2f8'] as const,
    description: 'Grows with health habits',
    gradientColors: ['#fb2c36', '#f6339a'] as const,
    iconColor: '#fb2c36',
  },
  wisdom: {
    bgGradient: ['#f3e8ff', '#eef2ff'] as const,
    description: 'Earned from learning habits',
    gradientColors: ['#ad46ff', '#615fff'] as const,
    iconColor: '#ad46ff',
  },
} as const;

export const AVATAR_GRADIENT = ['#ad46ff', '#f6339a'] as const;
export const XP_GRADIENT = ['#ad46ff', '#f6339a'] as const;
export const TROPHY_GRADIENT = ['#ff8c00', '#ff6900'] as const;
