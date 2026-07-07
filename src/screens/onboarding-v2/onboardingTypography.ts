/**
 * onboardingTypography — shared type tokens for the onboarding-v2 conversion funnel.
 *
 * Switches funnel copy onto the app's Literata (serif headline) + DM Sans (body)
 * pairing, replacing the previous ad-hoc system-font styling. Persuasion numerals
 * (e.g. the 96px strike numeral, the 40px ProblemStep headline) intentionally stay
 * as local constants in their step files — they are display graphics, not copy.
 *
 * Pattern mirrors LibraryHero.styles.ts (heading1 base + explicit size/line override).
 */
import type { TextStyle } from 'react-native';
import { typography } from '@/theme/typography';

// Hero headline — Literata serif at the screen-title scale (28px), per the serif rule.
const heroHeadline: TextStyle = {
  ...typography.heading1,
  fontSize: 28,
  lineHeight: 34,
};

// Eyebrow / kicker — uppercase overline (DM Sans).
const eyebrow: TextStyle = {
  ...typography.overline,
};

// Body / supporting copy — DM Sans, 15px.
const bodyText: TextStyle = {
  ...typography.bodySmall,
  fontSize: 15,
  lineHeight: 22,
};

// Primary CTA label — DM Sans semibold, 16px.
const ctaLabel: TextStyle = {
  ...typography.button,
  fontSize: 16,
};

export const onboardingTypography = {
  bodyText,
  ctaLabel,
  eyebrow,
  heroHeadline,
};
