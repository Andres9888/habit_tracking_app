export interface Testimonial {
  id: string;
  initials: string;
  meta: string;
  name: string;
  quote: string;
}

/**
 * Aspirational placeholders until real reviews are collected.
 * Replace post-launch with App Store reviews.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 't1',
    initials: 'JK',
    meta: 'Morning walks · 4 months in',
    name: 'Jamie · Restarter, 34',
    quote:
      "I've missed days. The tier didn't disappear. That's the part that kept me coming back.",
  },
  {
    id: 't2',
    initials: 'SR',
    meta: '500 words a day · 2 months in',
    name: 'Sam · Writer, 41',
    quote:
      "I hit iron last week. It's the first time a habit app actually told me something I didn't already know about myself.",
  },
];
