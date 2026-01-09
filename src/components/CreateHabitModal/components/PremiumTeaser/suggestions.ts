/**
 * AI suggestion mockups based on habit name patterns.
 * In production, these would come from an AI backend.
 */

const SUGGESTION_PATTERNS: Array<{
  keywords: string[];
  suggestions: [string, string];
}> = [
  {
    keywords: ['read'],
    suggestions: ['Best time: 9 PM before bed', 'Pair with: Evening tea ☕'],
  },
  {
    keywords: ['meditat', 'mindful'],
    suggestions: [
      'Best time: 7 AM after waking',
      'Pair with: Morning stretch 🧘',
    ],
  },
  {
    keywords: ['run', 'jog', 'walk'],
    suggestions: ['Best time: 6:30 AM', 'Pair with: Drink water 💧'],
  },
  {
    keywords: ['water', 'drink'],
    suggestions: ['Best time: Every 2 hours', 'Start with: After each meal'],
  },
  {
    keywords: ['journal', 'write'],
    suggestions: ['Best time: Before bed', 'Pair with: Gratitude practice 🙏'],
  },
  {
    keywords: ['workout', 'gym', 'exercise'],
    suggestions: ['Best time: 5 PM after work', 'Pair with: Protein shake 🥤'],
  },
];

const DEFAULT_SUGGESTIONS: [string, string] = [
  'Personalized timing suggestions',
  'Smart habit pairing recommendations',
];

export function getAISuggestions(name: string): string[] {
  const query = name.toLowerCase();

  for (const pattern of SUGGESTION_PATTERNS) {
    if (pattern.keywords.some((keyword) => query.includes(keyword))) {
      return pattern.suggestions;
    }
  }

  return DEFAULT_SUGGESTIONS;
}
