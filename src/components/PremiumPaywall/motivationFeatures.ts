/**
 * Motivation feature data for motivation/benefits variants.
 *
 * Same rule as `RevenueCatPaywall/paywall.constants.ts`: a card here is a
 * purchasable claim, so it may only describe something the app ships and gates.
 * The previous four cards sold Unlimited Voice Notes and a Vision Board that
 * have no schema field, no UI, and no mutation anywhere in the codebase, plus a
 * Rescue Mode whose `useRescueTrigger` hook is never mounted — a subscriber
 * paid and received none of them.
 *
 * `freeLimit` / `premiumValue` must state the real boundary. The active-habit
 * cap in convex/subscriptions/freeTier.ts is currently the only one.
 */

import { Infinity as InfinityIcon, Archive, Layers } from 'lucide-react-native';
import { FREE_HABIT_LIMIT } from '../../lib/premium/freeTier';
import type { MotivationFeatureItem } from './PremiumPaywall.types';

export const MOTIVATION_FEATURES: readonly MotivationFeatureItem[] = [
  {
    accentColor: '#10b981',
    description:
      'Build as many habits as you want at once — no slots to budget, nothing to drop to make room.',
    freeLimit: `${FREE_HABIT_LIMIT} active habits`,
    icon: InfinityIcon,
    id: 'unlimitedHabits',
    premiumValue: 'Unlimited active habits',
    subtitle: 'No cap, no juggling',
    title: 'Unlimited Habits',
  },
  {
    accentColor: '#0ea5e9',
    description:
      'Morning routine, training block, work rituals, evening wind-down — run them together instead of picking three.',
    freeLimit: 'One area at a time',
    icon: Layers,
    id: 'everyArea',
    premiumValue: 'Every area at once',
    subtitle: 'Whole-life coverage',
    title: 'Every Area At Once',
  },
  {
    accentColor: '#f59e0b',
    description:
      'Shelve a habit for a season and bring it back whenever you want — restoring never waits on a free slot.',
    freeLimit: 'Blocked while full',
    icon: Archive,
    id: 'archiveRestore',
    premiumValue: 'Restore any time',
    subtitle: 'Your history stays reachable',
    title: 'Restore Any Time',
  },
];
