import type { BurstConfig } from '../types';

export const PERFECT_WEEK_CONFIG: BurstConfig = {
  particleCount: 50,
  duration: 3000,
  colors: [
    '#EF4444',
    '#F97316',
    '#EAB308',
    '#22C55E',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
  ],
  darkColors: [
    '#F87171',
    '#FB923C',
    '#FACC15',
    '#4ADE80',
    '#60A5FA',
    '#A78BFA',
    '#F472B6',
  ],
  physics: {
    drag: 0.99,
    gravity: 180,
    rotation: { velocity: [-150, 150] },
    velocity: { x: [-120, 120], y: [-300, -180] },
    wind: 0,
  },
  hapticPattern: 'celebrationMajor',
  soundType: 'success',
  emissionDelay: 8,
};
