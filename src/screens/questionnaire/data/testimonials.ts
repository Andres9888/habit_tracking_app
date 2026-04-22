export interface Testimonial {
  id: string;
  initials: string;
  personaTag: string;
  quote: string;
}

// PLACEHOLDER — aspirational copy approved for launch.
// Replace with real App Store / TestFlight reviews once collected.
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'm-b',
    initials: 'M.B.',
    personaTag: 'Busy parent',
    quote:
      'The chain visual finally made habits click. I hit 40 days on meditation — longer than I ever have.',
  },
  {
    id: 'j-l',
    initials: 'J.L.',
    personaTag: 'Founder',
    quote:
      'Every other app felt like homework. Chain Day is the only one where my streak still matters — 90 days in.',
  },
  {
    id: 'a-k',
    initials: 'A.K.',
    personaTag: 'Student',
    quote:
      'I stopped overcommitting. 3 check-ins a day, 6 weeks in, and I am finally sticking with something.',
  },
];
