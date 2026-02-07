/**
 * Constants for ShareCardGenerator component
 * Based on UX Specification Flow 5 (lines 560-661)
 */

import type {
  SharePlatform,
  ShareFormat,
  MilestoneLevel,
  MilestoneConfig,
  GradientPreset,
} from './ShareCardGenerator.types';

export const SHARE_FORMATS: Record<SharePlatform, ShareFormat> = {
  facebook: { aspectRatio: 1.91, height: 630, width: 1200 },
  'instagram-feed': { aspectRatio: 1, height: 1080, width: 1080 },
  'instagram-story': { aspectRatio: 9 / 16, height: 1920, width: 1080 },
  twitter: { aspectRatio: 16 / 9, height: 675, width: 1200 },
};

export const MILESTONE_CONFIG: Record<MilestoneLevel, MilestoneConfig> = {
  automatic: { emoji: '⚡', label: 'Automatic', range: '80-100%' },
  building: { emoji: '🌿', label: 'Building', range: '20-40%' },
  developing: { emoji: '🌳', label: 'Developing', range: '40-60%' },
  starting: { emoji: '🌱', label: 'Starting', range: '0-20%' },
  strong: { emoji: '💪', label: 'Strong', range: '60-80%' },
};

// Intentional: static colors for share card rendering (gradient backgrounds baked into shared images)
export const GRADIENT_PRESETS: GradientPreset[] = [
  { colors: ['#10B981', '#059669', '#047857'], name: 'Growth' },
  { colors: ['#34D399', '#10B981', '#059669'], name: 'Achievement' },
  { colors: ['#047857', '#065F46', '#064E3B'], name: 'Excellence' },
  { colors: ['#3B82F6', '#2563EB', '#1D4ED8'], name: 'Sky' },
  { colors: ['#F59E0B', '#D97706', '#B45309'], name: 'Sunset' },
];

export const APP_STORE_LINK = 'https://apps.apple.com/app/chain-day';

export const DEFAULT_PLATFORM: SharePlatform = 'instagram-story';

export const MESSAGE_MAX_LENGTH = 100;
