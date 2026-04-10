/**
 * Static habit pairing suggestions
 * Maps categories to recommended companion categories with context
 */

export interface HabitPairing {
  targetCategory: string;
  reason: string;
}

/**
 * For each category, suggest 2 companion categories with reasons.
 * Used in FullsizeTemplatePreview "Pairs well with" section.
 */
export const CATEGORY_PAIRINGS: Record<string, HabitPairing[]> = {
  andrew_huberman: [
    { targetCategory: 'morning_routine', reason: 'Layer protocols into your morning' },
    { targetCategory: 'breathing', reason: 'Combine with breathwork for nervous system control' },
  ],
  breathing: [
    { targetCategory: 'mindfulness', reason: 'Deepen your practice with awareness' },
    { targetCategory: 'sleep', reason: 'Wind down with breathwork before bed' },
  ],
  creativity: [
    { targetCategory: 'mindfulness', reason: 'Clear your mind to spark ideas' },
    { targetCategory: 'learning', reason: 'Feed your creativity with new knowledge' },
  ],
  financial: [
    { targetCategory: 'productivity', reason: 'Build systems that support your goals' },
    { targetCategory: 'learning', reason: 'Grow your financial knowledge' },
  ],
  health_fitness: [
    { targetCategory: 'sleep', reason: 'Recovery is where gains happen' },
    { targetCategory: 'morning_routine', reason: 'Start strong with morning movement' },
  ],
  learning: [
    { targetCategory: 'productivity', reason: 'Apply what you learn right away' },
    { targetCategory: 'creativity', reason: 'Knowledge fuels creative output' },
  ],
  longevity: [
    { targetCategory: 'health_fitness', reason: 'Combine with exercise for compounding benefits' },
    { targetCategory: 'sleep', reason: 'Sleep is the foundation of longevity' },
  ],
  mental_health: [
    { targetCategory: 'mindfulness', reason: 'Build emotional awareness alongside resilience' },
    { targetCategory: 'social', reason: 'Connection is protective for mental health' },
  ],
  mindfulness: [
    { targetCategory: 'morning_routine', reason: 'Anchor mindfulness to your morning' },
    { targetCategory: 'breathing', reason: 'Breathwork amplifies awareness' },
  ],
  morning_routine: [
    { targetCategory: 'mindfulness', reason: 'Start your day with calm focus' },
    { targetCategory: 'health_fitness', reason: 'Morning movement sets the tone' },
  ],
  productivity: [
    { targetCategory: 'morning_routine', reason: 'Win the morning, win the day' },
    { targetCategory: 'mindfulness', reason: 'Focus requires a clear mind' },
  ],
  recovery: [
    { targetCategory: 'sleep', reason: 'Sleep is the ultimate recovery tool' },
    { targetCategory: 'breathing', reason: 'Breathwork activates parasympathetic recovery' },
  ],
  sleep: [
    { targetCategory: 'breathing', reason: 'Regulate your nervous system before bed' },
    { targetCategory: 'mindfulness', reason: 'Quiet your mind for deeper sleep' },
  ],
  social: [
    { targetCategory: 'mental_health', reason: 'Strong relationships boost wellbeing' },
    { targetCategory: 'mindfulness', reason: 'Be more present in conversations' },
  ],
};
