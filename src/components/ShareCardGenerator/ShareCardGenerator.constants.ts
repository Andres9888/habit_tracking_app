/**
 * Constants for ShareCardGenerator component
 */

import type {
  SharePlatform,
  ShareFormat,
  MilestoneLevel,
  MilestoneConfig,
  GradientPreset,
} from './ShareCardGenerator.types';

export const SHARE_FORMATS: Record<SharePlatform, ShareFormat> = {
  'instagram-story': { aspectRatio: 9 / 16, height: 1920, width: 1080 },
  twitter: { aspectRatio: 16 / 9, height: 675, width: 1200 },
  whatsapp: { aspectRatio: 1, height: 1080, width: 1080 },
};

// Legacy levels retained for backward compatibility
export const MILESTONE_CONFIG: Record<MilestoneLevel, MilestoneConfig> = {
  automatic: { emoji: '⚡', label: 'Automatic', range: '80-100%' },
  building: { emoji: '🌿', label: 'Building', range: '20-40%' },
  developing: { emoji: '🌳', label: 'Developing', range: '40-60%' },
  starting: { emoji: '🌱', label: 'Starting', range: '0-20%' },
  strong: { emoji: '💪', label: 'Strong', range: '60-80%' },
};

export const STREAK_MILESTONE_CONFIG = {
  7: {
    emoji: '🔥',
    label: '7 Day Streak',
    message: 'Consistency beats intensity. Keep the chain alive!',
  },
  30: {
    emoji: '🏆',
    label: '30 Day Streak',
    message: 'A month of momentum. You are building something real.',
  },
  100: {
    emoji: '👑',
    label: '100 Day Streak',
    message: 'Legendary discipline. This is what commitment looks like.',
  },
} as const;

// Intentional: static colors for share card rendering
export const GRADIENT_PRESETS: GradientPreset[] = [
  { colors: ['#34D399', '#10B981', '#047857'], name: '7 Day Spark' },
  { colors: ['#F59E0B', '#D97706', '#B45309'], name: '30 Day Momentum' },
  { colors: ['#8B5CF6', '#6D28D9', '#4C1D95'], name: '100 Day Legend' },
  { colors: ['#3B82F6', '#2563EB', '#1D4ED8'], name: 'Sky' },
  { colors: ['#111827', '#1F2937', '#374151'], name: 'Night' },
];

export const APP_STORE_LINK = 'https://apps.apple.com/app/chain-day';

export const DEFAULT_PLATFORM: SharePlatform = 'instagram-story';

export const MESSAGE_MAX_LENGTH = 100;
