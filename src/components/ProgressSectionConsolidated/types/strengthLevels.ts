/**
 * Strength Levels Constants
 *
 * Level threshold configuration for habit strength display.
 */

import type { LevelThreshold } from './data.types';

export const STRENGTH_LEVELS: LevelThreshold[] = [
  {
    bgColor: '#ecfccb',
    color: '#65a30d',
    description: 'Just getting started',
    emoji: '🌱',
    label: 'Starting Out',
    max: 20,
    min: 0,
  },
  {
    bgColor: '#dcfce7',
    color: '#16a34a',
    description: 'Building momentum',
    emoji: '🌿',
    label: 'Building',
    max: 40,
    min: 20,
  },
  {
    bgColor: '#d1fae5',
    color: '#059669',
    description: 'Habit is taking root',
    emoji: '🌳',
    label: 'Growing',
    max: 60,
    min: 40,
  },
  {
    bgColor: '#cffafe',
    color: '#0891b2',
    description: 'Solid consistency',
    emoji: '💪',
    label: 'Strong',
    max: 80,
    min: 60,
  },
  {
    bgColor: '#ede9fe',
    color: '#7c3aed',
    description: 'Habit mastery achieved',
    emoji: '⚡',
    label: 'Unbreakable',
    max: 101,
    min: 80,
  },
];
