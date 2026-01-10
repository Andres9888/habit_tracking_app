/**
 * Premium motivation features data
 */

import { Mic, Mail, Image, Sparkles, Shield, Eye } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
  freeLimit: string;
  premiumValue: string;
  scienceFact: string;
}

export const PREMIUM_FEATURES: readonly PremiumFeature[] = [
  {
    accentColor: '#14b8a6',
    description: 'Record audio motivation from your most inspired moments',
    freeLimit: '1 recording',
    icon: Mic,
    id: 'voiceNotes',
    premiumValue: 'Unlimited recordings',
    scienceFact: 'Voice has 40% higher emotional recall than text',
    title: 'Unlimited Voice Notes',
  },
  {
    accentColor: '#8b5cf6',
    description: 'Write time-locked messages that unlock in the future',
    freeLimit: 'Not available',
    icon: Mail,
    id: 'letters',
    premiumValue: 'Unlimited letters',
    scienceFact: 'Connecting with future self increases self-control',
    title: 'Letters to Self',
  },
  {
    accentColor: '#d946ef',
    description: 'Create a visual collection of your motivation',
    freeLimit: 'Not available',
    icon: Image,
    id: 'visionBoard',
    premiumValue: '4 images per habit',
    scienceFact: 'Personal images create stronger emotional connections',
    title: 'Vision Board',
  },
  {
    accentColor: '#f59e0b',
    description: 'Add as many daily affirmations as you need',
    freeLimit: '2 affirmations',
    icon: Sparkles,
    id: 'affirmations',
    premiumValue: 'Unlimited affirmations',
    scienceFact: 'Repetition builds neural pathways',
    title: 'Unlimited Affirmations',
  },
  {
    accentColor: '#ef4444',
    description: 'Get interventions when your streak is at risk',
    freeLimit: 'Not available',
    icon: Shield,
    id: 'rescueMode',
    premiumValue: 'Smart streak protection',
    scienceFact: 'Streak rescue is #1 retention driver (Duolingo)',
    title: 'Rescue Mode',
  },
  {
    accentColor: '#10b981',
    description: 'Full Huberman protocol with Body/Mind/Emotion breakdown',
    freeLimit: 'Basic visualization',
    icon: Eye,
    id: 'advancedViz',
    premiumValue: 'Complete protocol',
    scienceFact: 'Fear moves you 2x better when unmotivated',
    title: 'Advanced Visualization',
  },
];
