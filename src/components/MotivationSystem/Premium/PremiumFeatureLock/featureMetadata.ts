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
    description:
      'Full Huberman protocol — visualize Body, Mind, and Emotion together.',
    scienceBasis: 'Fear visualization moves you 2x better when unmotivated',
    title: 'Advanced Visualization',
  },
  rescueMode: {
    description:
      'Smart alerts when your streak is at risk — never lose progress again.',
    scienceBasis: 'Streak protection is #1 retention driver (Duolingo)',
    title: 'Rescue Mode',
  },
  visionBoard: {
    description: 'Pin images that inspire you — see your "why" every day.',
    scienceBasis: 'Personal images create stronger emotional connections',
    title: 'Vision Board',
  },
  voiceNotes: {
    description:
      'Capture your voice when motivation peaks — replay it when you need it most.',
    freeLimit: '1 recording',
    scienceBasis: 'Voice has 40% higher emotional recall than text',
    title: 'Voice Notes',
  },
};
