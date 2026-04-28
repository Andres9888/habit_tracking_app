/**
 * Estimated path lengths to "habit formed" — the destination of the
 * countdown framing. Per Lally et al. 2010, habit formation ranges
 * 18–254 days with a median of 66. These are short-term placeholders
 * matched by template name keyword; a future schema change should add
 * `estimatedPathDays` directly to the templates table for accuracy.
 */

export interface PathEstimate {
  /** Days until "habit formed" — the countdown destination. */
  days: number;
  /** 1 = easy, 2 = medium, 3 = hard. */
  difficulty: 1 | 2 | 3;
  /** Display label. */
  difficultyLabel: 'Easy' | 'Medium' | 'Hard';
}

const KEYWORD_RULES: Array<{
  keywords: readonly string[];
  estimate: PathEstimate;
}> = [
  {
    estimate: { days: 21, difficulty: 1, difficultyLabel: 'Easy' },
    keywords: [
      'walk',
      'water',
      'glass',
      '5-min',
      '5 min',
      '5-minute',
      'gratitude',
    ],
  },
  {
    estimate: { days: 66, difficulty: 2, difficultyLabel: 'Medium' },
    keywords: [
      'meditation',
      'meditate',
      'reading',
      'read ',
      'pages',
      'journal',
      'workout',
      'stretch',
      'yoga',
      'sleep',
    ],
  },
  {
    estimate: { days: 120, difficulty: 3, difficultyLabel: 'Hard' },
    keywords: [
      'writing',
      'creative',
      'practice',
      'language',
      'instrument',
      'study',
      'code',
    ],
  },
];

const DEFAULT_ESTIMATE: PathEstimate = {
  days: 45,
  difficulty: 2,
  difficultyLabel: 'Medium',
};

/**
 * Estimate the path-to-formation length for a habit by name keyword.
 * Falls back to a 45-day medium estimate if no keyword matches.
 */
export function estimatePath(habitName: string): PathEstimate {
  const lower = habitName.toLowerCase();
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule.estimate;
    }
  }
  return DEFAULT_ESTIMATE;
}

/**
 * Proportional positions (0–1) where the tier landmarks sit on any
 * path, regardless of total length. Copper at ~25%, iron at ~65%,
 * gold at the destination (100%, where habit formation lands).
 */
export const TIER_POSITIONS = {
  copper: 0.25,
  iron: 0.65,
  gold: 1.0,
} as const;
