import type { LevelConfig } from '../types';

// Animation constants
export const RING_ANIMATION_DURATION = 1200;

// Ring dimensions (88px as per spec)
export const RING_SIZE = 88;
export const STROKE_WIDTH = 8;

// Level configurations
export const STRENGTH_LEVELS: Record<string, LevelConfig> = {
  automatic: {
    color: '#059669', // emerald-600
    colorLight: '#d1fae5', // emerald-100
    description: 'This habit is second nature!',
    emoji: '⚡',
    label: 'Automatic',
    maxThreshold: 100,
    minThreshold: 80,
  },
  building: {
    color: '#16a34a', // green-600
    colorLight: '#dcfce7', // green-100
    description: 'Making good progress',
    emoji: '🌿',
    label: 'Building',
    maxThreshold: 40,
    minThreshold: 20,
  },
  developing: {
    color: '#0d9488', // teal-600
    colorLight: '#ccfbf1', // teal-100
    description: 'Getting stronger every day',
    emoji: '🌳',
    label: 'Developing',
    maxThreshold: 60,
    minThreshold: 40,
  },
  starting: {
    color: '#4D7A0A', // lime-600
    colorLight: '#ecfccb', // lime-100
    description: 'Just getting started',
    emoji: '🌱',
    label: 'Starting Out',
    maxThreshold: 20,
    minThreshold: 0,
  },
  strong: {
    color: '#0891b2', // cyan-600
    colorLight: '#cffafe', // cyan-100
    description: 'Well-established habit',
    emoji: '💪',
    label: 'Strong',
    maxThreshold: 80,
    minThreshold: 60,
  },
};

// Emoji markers for progress bar
export const LEVEL_EMOJIS = ['🌱', '🌿', '🌳', '💪', '⚡'];
