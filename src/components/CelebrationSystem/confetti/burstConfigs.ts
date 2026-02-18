/**
 * Burst Configurations
 *
 * Predefined configurations for each celebration burst type.
 * Includes physics, colors, haptics, and audio settings.
 */

import type { BurstConfig } from './types';

/**
 * Default physics - gentle upward float
 */
const DEFAULT_PHYSICS = {
  drag: 0.99,
  gravity: 200,
  rotation: { velocity: [-180, 180] },
  velocity: { x: [-100, 100], y: [-300, -150] },
  wind: 0,
};

/**
 * Chain completion - upward fountain with green emphasis
 * Celebrates completing habits in sequence
 */
export const CHAIN_COMPLETION_CONFIG: BurstConfig = {
  particleCount: 25,
  duration: 2000,
  colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#059669', '#047857'],
  darkColors: ['#34D399', '#6EE7B7', '#A7F3D0', '#10B981', '#6EE7B7', '#34D399'],
  physics: {
    drag: 0.99,
    gravity: 150,
    rotation: { velocity: [-120, 120] },
    velocity: { x: [-80, 80], y: [-250, -120] },
    wind: 20,
  },
  hapticPattern: 'success',
  soundType: 'pop',
  emissionDelay: 15,
};

/**
 * Streak milestone - golden burst with wind
 * Celebrates reaching streak milestones (7, 14, 30, 100 days)
 */
export const STREAK_MILESTONE_CONFIG: BurstConfig = {
  particleCount: 40,
  duration: 2500,
  colors: [
    '#FBBF24',
    '#F59E0B',
    '#E8B94D',
    '#8B6208',
    '#7D5907',
    '#FEF3CD',
    '#FCD34D',
  ],
  darkColors: [
    '#FBBF24',
    '#F59E0B',
    '#E8B94D',
    '#FCD34D',
    '#FEF3CD',
    '#FBBF24',
    '#F59E0B',
  ],
  physics: {
    drag: 0.985,
    gravity: 250,
    rotation: { velocity: [-200, 200] },
    velocity: { x: [-150, 150], y: [-350, -200] },
    wind: -30,
  },
  hapticPattern: 'streak',
  soundType: 'chime',
  emissionDelay: 10,
};

/**
 * Level up - purple/violet explosion
 * Celebrates habit strength level increases
 */
export const LEVEL_UP_CONFIG: BurstConfig = {
  particleCount: 35,
  duration: 2200,
  colors: [
    '#8B5CF6',
    '#7B52C4',
    '#6D3AC7',
    '#5A2DA8',
    '#A78BFA',
    '#C4B5FD',
    '#7C3AED',
  ],
  darkColors: [
    '#A78BFA',
    '#C4B5FD',
    '#8B5CF6',
    '#7B52C4',
    '#A78BFA',
    '#C4B5FD',
    '#8B5CF6',
  ],
  physics: {
    drag: 0.98,
    gravity: 200,
    rotation: { velocity: [-240, 240] },
    velocity: { x: [-200, 200], y: [-400, -250] },
    wind: 10,
  },
  hapticPattern: 'celebration',
  soundType: 'success',
  emissionDelay: 12,
};

/**
 * Perfect week - rainbow celebration
 * Celebrates completing all habits for a full week
 */
export const PERFECT_WEEK_CONFIG: BurstConfig = {
  particleCount: 50,
  duration: 3000,
  colors: [
    '#EF4444', // Red
    '#F97316', // Orange
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
  ],
  darkColors: [
    '#F87171', // Red (brighter)
    '#FB923C', // Orange (brighter)
    '#FACC15', // Yellow (brighter)
    '#4ADE80', // Green (brighter)
    '#60A5FA', // Blue (brighter)
    '#A78BFA', // Purple (brighter)
    '#F472B6', // Pink (brighter)
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

/**
 * Default completion - modest green burst
 * Regular habit completion
 */
export const DEFAULT_CONFIG: BurstConfig = {
  particleCount: 15,
  duration: 1500,
  colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  darkColors: ['#34D399', '#6EE7B7', '#A7F3D0', '#10B981'],
  physics: DEFAULT_PHYSICS,
  hapticPattern: 'tap',
  soundType: 'pop',
};

/**
 * Get configuration for a burst type
 */
export function getBurstConfig(
  burstType: BurstType,
  isDarkMode: boolean
): BurstConfig {
  switch (burstType) {
    case 'chainCompletion':
      return CHAIN_COMPLETION_CONFIG;
    case 'streakMilestone':
      return STREAK_MILESTONE_CONFIG;
    case 'levelUp':
      return LEVEL_UP_CONFIG;
    case 'perfectWeek':
      return PERFECT_WEEK_CONFIG;
    case 'default':
    default:
      return DEFAULT_CONFIG;
  }
}

/**
 * Get colors for a burst type based on theme
 */
export function getBurstColors(burstType: BurstType, isDarkMode: boolean): string[] {
  const config = getBurstConfig(burstType, isDarkMode);
  return isDarkMode ? config.darkColors : config.colors;
}
