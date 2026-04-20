export interface Testimonial {
  id: string;
  initials: string;
  personaTag: string;
  quote: string;
}

// TODO: Replace with real App Store / TestFlight reviews before launch.
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
      'I quit four habit apps before this. Chain Day is the only one I still open every morning.',
  },
  {
    id: 'a-k',
    initials: 'A.K.',
    personaTag: 'Student',
    quote:
      'Tracking 3 tiny habits a day beat every elaborate planner I used to buy.',
  },
];
