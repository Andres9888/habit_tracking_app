/**
 * Habit Packs - Static data for curated habit bundles
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
      { emoji: '🌅', frequency: 'Daily', name: 'Morning Sunlight Viewing' },
      { emoji: '🧊', frequency: 'Daily', name: 'Deliberate Cold Exposure' },
      { emoji: '🧘', frequency: 'Daily', name: 'NSDR Practice' },
      { emoji: '🥩', frequency: 'Daily', name: 'Morning Protein Protocol' },
      { emoji: '🏋️', frequency: 'Daily', name: 'Zone 2 Cardio Training' },
    ],
    id: 'huberman-essentials',
    name: 'Huberman Essentials',
  },
  {
    backgroundGradient: ['#059669', '#047857'],
    description: 'Build an unshakeable morning foundation',
    emojiGroup: ['🌅', '📝', '🧘', '💧'],
    habits: [
      { emoji: '🌅', frequency: 'Daily', name: 'Consistent Wake Time' },
      { emoji: '💧', frequency: 'Daily', name: 'Hydration First' },
      { emoji: '📝', frequency: 'Daily', name: 'Morning Pages' },
      { emoji: '🧘', frequency: 'Daily', name: '5-Minute Meditation' },
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
      { emoji: '📖', frequency: 'Daily', name: 'Daily Reading' },
      { emoji: '🧠', frequency: 'Daily', name: 'Gratitude Journaling' },
      { emoji: '😴', frequency: 'Daily', name: 'Digital Detox Hour' },
    ],
    id: 'mindful-peak',
    name: 'Mindful Peak',
  },
];
