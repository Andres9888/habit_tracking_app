/**
 * Social proof testimonials mapped by goal ID.
 */

export interface Testimonial {
  quote: string;
  author: string;
}

export const DEFAULT_TESTIMONIAL: Testimonial = {
  quote: 'I tried every habit app out there. Chain Day is the first one that actually made habits stick beyond the first week.',
  author: 'Sarah K., 94-day chain',
};

export const TESTIMONIALS: Record<string, Testimonial> = {
  health: {
    quote: 'I went from skipping workouts to a 60-day streak. The chain visualization made me never want to break it.',
    author: 'Mike R., 60-day chain',
  },
  productivity: {
    quote: 'My morning routine used to be chaos. Now I have a 45-day deep work chain and my output has doubled.',
    author: 'Priya S., 45-day chain',
  },
  mindfulness: {
    quote: 'Ten minutes of meditation felt impossible. Chain Day helped me build to 20 minutes daily in just 3 weeks.',
    author: 'James L., 52-day chain',
  },
  learning: {
    quote: 'I finished 12 books in 3 months after starting a daily reading chain. The streaks are addictive.',
    author: 'Elena V., 78-day chain',
  },
  relationships: {
    quote: 'A simple "text a friend" habit chain transformed my social life. I feel more connected than ever.',
    author: 'David M., 40-day chain',
  },
  finances: {
    quote: 'Tracking spending daily seemed tedious, but the chain kept me going. Saved $3,200 in 4 months.',
    author: 'Aisha T., 110-day chain',
  },
};
