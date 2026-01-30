/**
 * Feature Metadata
 * Display information for each premium feature
 */

import type {
  MotivationPremiumFeature,
  FeatureMeta,
} from './PremiumFeatureLock.types';

export const FEATURE_META: Record<MotivationPremiumFeature, FeatureMeta> = {
  advancedViz: {
    description: 'Full Huberman protocol with Body/Mind/Emotion breakdown',
    scienceBasis: 'Fear visualization moves you 2x better when unmotivated',
    title: 'Advanced Visualization',
  },
  affirmations: {
    description: 'Add as many daily affirmations as you need',
    freeLimit: '2 affirmations',
    scienceBasis: 'Repetition builds neural pathways',
    title: 'Unlimited Affirmations',
  },
  letters: {
    description: 'Write time-locked messages to your future self',
    scienceBasis: 'Temporal self-continuity increases self-control',
    title: 'Letters to Self',
  },
  rescueMode: {
    description: 'Get interventions when your streak is at risk',
    scienceBasis: 'Streak protection is #1 retention driver (Duolingo)',
    title: 'Rescue Mode',
  },
  visionBoard: {
    description: 'Create a visual collection of your motivation',
    scienceBasis: 'Personal images create stronger emotional connections',
    title: 'Vision Board',
  },
  voiceNotes: {
    description: 'Record audio motivation from your most inspired moments',
    freeLimit: '1 recording',
    scienceBasis: 'Voice has 40% higher emotional recall than text',
    title: 'Voice Notes',
  },
};
