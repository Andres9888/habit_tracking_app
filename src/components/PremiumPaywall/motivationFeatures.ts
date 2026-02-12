/**
 * Motivation feature data for motivation/benefits variants
 */

import { Mic, Mail, Image, Sparkles, Shield, Eye } from 'lucide-react-native';
import type { MotivationFeatureItem } from './PremiumPaywall.types';

export const MOTIVATION_FEATURES: readonly MotivationFeatureItem[] = [
  {
    id: 'voiceNotes',
    title: 'Unlimited Voice Notes',
    subtitle: '40% higher emotional recall',
    description: 'Record audio motivation from your most inspired moments',
    icon: Mic,
    accentColor: '#14b8a6',
    freeLimit: '1 recording',
    premiumValue: 'Unlimited recordings',
    scienceFact: 'Voice has 40% higher emotional recall than text',
  },
  {
    id: 'letters',
    title: 'Letters to Self',
    subtitle: 'Time-locked motivation',
    description: 'Write time-locked messages that unlock in the future',
    icon: Mail,
    accentColor: '#8b5cf6',
    freeLimit: 'Not available',
    premiumValue: 'Unlimited letters',
    scienceFact: 'Connecting with future self increases self-control',
  },
  {
    id: 'visionBoard',
    title: 'Vision Board',
    subtitle: 'Visual goal reinforcement',
    description: 'Create a visual collection of your motivation',
    icon: Image,
    accentColor: '#d946ef',
    freeLimit: 'Not available',
    premiumValue: '4 images per habit',
    scienceFact: 'Personal images create stronger emotional connections',
  },
  {
    id: 'affirmations',
    title: 'Unlimited Affirmations',
    subtitle: 'Build neural pathways',
    description: 'Add as many daily affirmations as you need',
    icon: Sparkles,
    accentColor: '#f59e0b',
    freeLimit: '2 affirmations',
    premiumValue: 'Unlimited affirmations',
    scienceFact: 'Repetition builds neural pathways',
  },
  {
    id: 'rescueMode',
    title: 'Rescue Mode',
    subtitle: '#1 streak protection',
    description: 'Get interventions when your streak is at risk',
    icon: Shield,
    accentColor: '#ef4444',
    freeLimit: 'Not available',
    premiumValue: 'Smart streak protection',
    scienceFact: 'Streak rescue is #1 retention driver (Duolingo)',
  },
  {
    id: 'advancedViz',
    title: 'Advanced Visualization',
    subtitle: 'Fear moves you 2x better',
    description: 'Full Huberman protocol with Body/Mind/Emotion breakdown',
    icon: Eye,
    accentColor: '#10b981',
    freeLimit: 'Basic visualization',
    premiumValue: 'Complete protocol',
    scienceFact: 'Fear moves you 2x better when unmotivated',
  },
];
