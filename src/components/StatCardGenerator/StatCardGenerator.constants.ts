/**
 * Constants for StatCardGenerator component
 *
 * Visual design tokens, gradient presets, and card-type metadata.
 * All colours are baked into the exported image (not theme-aware) so that
 * shared cards look identical regardless of the recipient's device settings.
 */

import type {
  StatCardType,
  StatCardVariant,
  CardTypeConfig,
  VariantConfig,
} from './StatCardGenerator.types';

// ---------------------------------------------------------------------------
// Card-type metadata (displayed in the type selector)
// ---------------------------------------------------------------------------

export const CARD_TYPE_CONFIG: Record<StatCardType, CardTypeConfig> = {
  'streak-30day': {
    description: 'Your best current streaks',
    emoji: '🔥',
    label: '30-Day Streak',
    type: 'streak-30day',
  },
  'monthly-recap': {
    description: 'This month at a glance',
    emoji: '📊',
    label: 'Monthly Recap',
    type: 'monthly-recap',
  },
  'year-in-review': {
    description: 'Full-year highlights',
    emoji: '🌟',
    label: 'Year in Review',
    type: 'year-in-review',
  },
};

export const CARD_TYPE_ORDER: StatCardType[] = [
  'streak-30day',
  'monthly-recap',
  'year-in-review',
];

// ---------------------------------------------------------------------------
// Variant metadata
// ---------------------------------------------------------------------------

export const VARIANT_CONFIG: Record<StatCardVariant, VariantConfig> = {
  bold: {
    description: 'High-contrast & punchy',
    label: 'Bold',
    variant: 'bold',
  },
  dark: {
    description: 'Moody & elegant',
    label: 'Dark',
    variant: 'dark',
  },
  minimal: {
    description: 'Clean & airy',
    label: 'Minimal',
    variant: 'minimal',
  },
};

export const VARIANT_ORDER: StatCardVariant[] = ['minimal', 'bold', 'dark'];

// ---------------------------------------------------------------------------
// Gradient palettes for each variant
// Intentional: static colors baked into the shared image
// ---------------------------------------------------------------------------

/** Gradient stops for each variant – [top, bottom] */
export const VARIANT_GRADIENTS: Record<StatCardVariant, string[]> = {
  // Soft sage-to-forest green
  bold: ['#059669', '#047857', '#022c22'],
  // Deep charcoal with green accent
  dark: ['#111827', '#1F2937', '#064E3B'],
  // Pastel green to pure white
  minimal: ['#ECFDF5', '#D1FAE5', '#FFFFFF'],
};

/** Text colors for each variant (all text on the card) */
export const VARIANT_TEXT_COLORS: Record<
  StatCardVariant,
  {
    primary: string;
    secondary: string;
    accent: string;
    badge: string;
    badgeBg: string;
  }
> = {
  bold: {
    accent: '#34D399',
    badge: '#FFFFFF',
    badgeBg: 'rgba(255,255,255,0.18)',
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.75)',
  },
  dark: {
    accent: '#10B981',
    badge: '#10B981',
    badgeBg: 'rgba(16,185,129,0.15)',
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
  },
  minimal: {
    accent: '#047857',
    badge: '#047857',
    badgeBg: 'rgba(4,120,87,0.08)',
    primary: '#1F2937',
    secondary: '#6B7280',
  },
};

// ---------------------------------------------------------------------------
// Card image dimensions (Instagram square – ideal for all platforms)
// ---------------------------------------------------------------------------

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1080;
export const CARD_ASPECT_RATIO = 1;

// ---------------------------------------------------------------------------
// App attribution footer
// ---------------------------------------------------------------------------

export const APP_STORE_LINK = 'https://apps.apple.com/app/chain-day';
export const APP_NAME = 'Chain Day';
export const APP_TAGLINE = 'Build lasting habits with science';

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_CARD_TYPE: StatCardType = 'streak-30day';
export const DEFAULT_VARIANT: StatCardVariant = 'bold';
