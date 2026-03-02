/**
 * Premium Packs - Static data for curated habit bundles
 *
 * Packs are editorial groupings that change infrequently.
 * Each pack references existing template categories.
 */

export interface PremiumPackHabit {
  emoji: string;
  frequency: string;
  name: string;
}

export interface PremiumPack {
  backgroundGradient: [string, string];
  description: string;
  emojiGroup: string[];
  habits: PremiumPackHabit[];
  id: string;
  name: string;
}

export const PREMIUM_PACKS: PremiumPack[] = [
  {
    backgroundGradient: ['#7C3AED', '#4F46E5'],
    description: 'Science-backed protocols for peak performance',
    emojiGroup: ['🔬', '🧠', '💪', '🧬'],
    habits: [
      { emoji: '🌅', frequency: 'Daily', name: 'Morning Sunlight' },
      { emoji: '🧊', frequency: 'Daily', name: 'Cold Exposure' },
      { emoji: '🧘', frequency: 'Daily', name: 'NSDR Protocol' },
      { emoji: '💊', frequency: 'Daily', name: 'Supplement Stack' },
      { emoji: '🏋️', frequency: '3x/week', name: 'Zone 2 Cardio' },
    ],
    id: 'huberman-essentials',
    name: 'Huberman Essentials',
  },
  {
    backgroundGradient: ['#059669', '#047857'],
    description: 'Build an unshakeable morning foundation',
    emojiGroup: ['🌅', '📝', '🧘', '💧'],
    habits: [
      { emoji: '🌅', frequency: 'Daily', name: 'Wake Before 7am' },
      { emoji: '💧', frequency: 'Daily', name: 'Hydrate First' },
      { emoji: '📝', frequency: 'Daily', name: 'Morning Journal' },
      { emoji: '🧘', frequency: 'Daily', name: '10-Min Meditation' },
    ],
    id: 'morning-mastery',
    name: 'Morning Mastery',
  },
  {
    backgroundGradient: ['#0891B2', '#0E7490'],
    description: 'Optimize your mind for clarity and calm',
    emojiGroup: ['🧠', '📖', '🌬️', '😴'],
    habits: [
      { emoji: '🌬️', frequency: 'Daily', name: 'Box Breathing' },
      { emoji: '📖', frequency: 'Daily', name: 'Read 20 Pages' },
      { emoji: '🧠', frequency: 'Daily', name: 'Gratitude Practice' },
      { emoji: '😴', frequency: 'Daily', name: 'Digital Sunset' },
    ],
    id: 'mindful-peak',
    name: 'Mindful Peak',
  },
];
