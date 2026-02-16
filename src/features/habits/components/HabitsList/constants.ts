/**
 * HabitsList Constants
 *
 * Static data used by the monetization / upgrade UI within the HabitsList folder.
 * Animation and timing constants live in the global `@/constants` module and are
 * re-exported here for convenience (`ENTRANCE_STAGGER_DELAY`).
 */

/** Benefit items displayed in {@link PremiumBenefitsRow}. */
export const PREMIUM_BENEFITS = [
  {
    description:
      'Track every area of your life — health, learning, fitness, and more.',
    title: 'Unlimited habits',
  },
  {
    description:
      'Gentle nudges at the right time to keep your streaks alive.',
    title: 'Smart reminders',
  },
  {
    description:
      'See which habits stick, spot trends, and understand what drives your progress.',
    title: 'Deep insights',
  },
];

/** Testimonial content displayed in {@link SocialProofCard}. */
export const SOCIAL_PROOF = {
  attribution: 'Maya - 42-day streak',
  quote:
    '"Upgrading gave me the structure I needed. I finally track every routine and stay consistent."',
};

export {ENTRANCE_STAGGER_DELAY} from '@/constants';