/**
 * Solution cards mapped to pain point IDs.
 */

export interface Solution {
  emoji: string;
  title: string;
  description: string;
}

export const SOLUTION_MAP: Record<string, Solution> = {
  'lose-motivation': {
    emoji: '\u{1F525}',
    title: 'Visual chain streaks',
    description: 'A growing chain you can see makes skipping feel painful \u2014 in the best way.',
  },
  'too-busy': {
    emoji: '\u{26A1}',
    title: '2-minute micro-habits',
    description: 'Start so small it\u2019s impossible to say no. We expand once the chain is strong.',
  },
  forget: {
    emoji: '\u{1F514}',
    title: 'Smart reminders',
    description: 'Context-aware nudges tied to your routine, not random alarms you ignore.',
  },
  overwhelmed: {
    emoji: '\u{1F3AF}',
    title: 'One habit at a time',
    description: 'We sequence your habits so you build on wins instead of juggling everything.',
  },
  'no-accountability': {
    emoji: '\u{1F91D}',
    title: 'Chain buddies',
    description: 'Pair up with someone on the same journey. Their chain depends on yours.',
  },
  'unsure-what': {
    emoji: '\u{1F9ED}',
    title: 'Curated habit library',
    description: 'Science-backed habits matched to your goal. Just pick and start.',
  },
};

export const DEFAULT_SOLUTION_IDS = ['lose-motivation', 'unsure-what'] as const;
