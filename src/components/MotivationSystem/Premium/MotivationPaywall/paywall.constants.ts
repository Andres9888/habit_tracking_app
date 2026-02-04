/**
 * Paywall Redesign Constants
 * @see paywall-redesign-spec.md
 */

import { Crown, Sparkles, TrendingUp } from 'lucide-react-native';

/** Color Palette - Warm minimalism */
export const PAYWALL_COLORS = {
  accent: '#E5A84B',
  background: '#FAF8F5',
  border: '#E8E6E3',
  neutral: '#8A8680',
  surfaceElevated: '#FFFFFF',
  surfaceRecessed: '#F5F3F0',
  text: '#2C2C2C',
} as const;

/** Typography System */
export const PAYWALL_TYPOGRAPHY = {
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  h1: {
    fontSize: 42,
    fontWeight: '600' as const,
    letterSpacing: -0.84,
    lineHeight: 50,
  },
  h3: {
    fontSize: 21,
    fontWeight: '500' as const,
    letterSpacing: -0.21,
    lineHeight: 26,
  },
} as const;

/** Spacing (8px unit) */
export const SPACING = { lg: 24, md: 16, sm: 8, xl: 32, xs: 4 } as const;

/** Motion timing (ms) */
export const MOTION = {
  background: { delay: 0, duration: 200 },
  cta: { delay: 450, duration: 200 },
  features: { delay: 200, duration: 280 },
  headline: { delay: 100, duration: 280 },
  monthlyCard: { delay: 380, duration: 250 },
  yearlyCard: { delay: 300, duration: 350 },
} as const;

/** Feature list (3 items max per cognitive load spec) */
export const PAYWALL_FEATURES = [
  {
    description: 'Track as many habits as you want',
    icon: Crown,
    id: 'unlimited',
    title: 'Unlimited Habits',
  },
  {
    description: 'Deep insights into your progress',
    icon: TrendingUp,
    id: 'analytics',
    title: 'Advanced Analytics',
  },
  {
    description: 'Voice notes, letters & affirmations',
    icon: Sparkles,
    id: 'motivation',
    title: 'Motivation Tools',
  },
] as const;

/** Pricing data */
export const PRICING = {
  monthly: { name: 'Monthly', period: '/month', price: '$6.99' },
  yearly: {
    monthlyEquivalent: '$3.75/month',
    name: 'Yearly',
    period: '/year',
    price: '$44.99',
    savingsBadge: 'Save 46%',
  },
} as const;
