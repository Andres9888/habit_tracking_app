/**
 * HabitCard Color Constants
 * Implements home-screen-redesign-spec.md color palette
 * OPTIMIZED: Stronger border, proper text contrast
 */

export const REDESIGN_COLORS = {
  accent: '#E85D3B',
  accentMuted: '#F5DDD6',
  // Secondary info text
  cardBg: '#f0eeeb',

  cardSurface: '#FFFFFF',

  dominant: '#FAF8F5',

  // High contrast green for streaks
  metaText: '#6B7280',

  neutral: '#E5E2DE',

  // FIXED: Stronger border (was #C4BFB7)
  secondaryText: '#1c1917',
  // FIXED: Proper contrast (was #2D2A26)
  // New colors for optimized UI
  streakText: '#047857', // Background layer for card container
} as const;
