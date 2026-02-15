/**
 * Motivation feature data for motivation/benefits variants
 */

import { Mic, Mail, Image, Sparkles, Shield, Eye } from 'lucide-react-native';

import type { MotivationFeatureItem } from './PremiumPaywall.types';

export const MOTIVATION_FEATURES: readonly MotivationFeatureItem[] = [
  {
    accentColor: '#14b8a6',
    description: 'Capture your voice when motivation peaks — replay it when you need it most.',
    freeLimit: '1 recording',
    icon: Mic,
    id: 'voiceNotes',
    premiumValue: 'Unlimited recordings',
    scienceFact: 'Voice has 40% higher emotional recall than text',
    subtitle: '40% higher emotional recall',
    title: 'Unlimited Voice Notes',
  },
  {
    accentColor: '#8b5cf6',
    description: 'Write messages to your future self that unlock at the perfect moment.',
    freeLimit: 'Not available',
    icon: Mail,
    id: 'letters',
    premiumValue: 'Unlimited letters',
    scienceFact: 'Connecting with future self increases self-control',
    subtitle: 'Time-locked motivation',
    title: 'Letters to Self',
  },
  {
    accentColor: '#d946ef',
    description: 'Pin images that inspire you — see your "why" every day.',
    freeLimit: 'Not available',
    icon: Image,
    id: 'visionBoard',
    premiumValue: '4 images per habit',
    scienceFact: 'Personal images create stronger emotional connections',
    subtitle: 'Visual goal reinforcement',
    title: 'Vision Board',
  },
  {
    accentColor: '#f59e0b',
    description: 'Build the mindset that sticks — unlimited daily affirmations.',
    freeLimit: '2 affirmations',
    icon: Sparkles,
    id: 'affirmations',
    premiumValue: 'Unlimited affirmations',
    scienceFact: 'Repetition builds neural pathways',
    subtitle: 'Build neural pathways',
    title: 'Unlimited Affirmations',
  },
  {
    accentColor: '#ef4444',
    description: 'Smart alerts when your streak is at risk — never lose progress again.',
    freeLimit: 'Not available',
    icon: Shield,
    id: 'rescueMode',
    premiumValue: 'Smart streak protection',
    scienceFact: 'Streak rescue is #1 retention driver (Duolingo)',
    subtitle: '#1 streak protection',
    title: 'Rescue Mode',
  },
  {
    accentColor: '#10b981',
    description: 'Full Huberman protocol — visualize Body, Mind, and Emotion together.',
    freeLimit: 'Basic visualization',
    icon: Eye,
    id: 'advancedViz',
    premiumValue: 'Complete protocol',
    scienceFact: 'Fear moves you 2x better when unmotivated',
    subtitle: 'Fear moves you 2x better',
    title: 'Advanced Visualization',
  },
];
