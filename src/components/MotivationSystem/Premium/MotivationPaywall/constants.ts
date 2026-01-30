/**
 * Constants for MotivationPaywall component
 */

import { Mic, Mail, Image, Sparkles, Shield, Eye } from 'lucide-react-native';
import type { PaywallFeature } from './types';

/**
 * Feature display data for the paywall
 */
export const PAYWALL_FEATURES: readonly PaywallFeature[] = [
  {
    icon: Mic,
    id: 'voiceNotes',
    subtitle: '40% higher emotional recall',
    title: 'Unlimited Voice Notes',
  },
  {
    icon: Mail,
    id: 'letters',
    subtitle: 'Time-locked motivation',
    title: 'Letters to Self',
  },
  {
    icon: Image,
    id: 'visionBoard',
    subtitle: 'Visual goal reinforcement',
    title: 'Vision Board',
  },
  {
    icon: Sparkles,
    id: 'affirmations',
    subtitle: 'Build neural pathways',
    title: 'Unlimited Affirmations',
  },
  {
    icon: Shield,
    id: 'rescueMode',
    subtitle: '#1 streak protection',
    title: 'Rescue Mode',
  },
  {
    icon: Eye,
    id: 'advancedViz',
    subtitle: 'Fear moves you 2x better',
    title: 'Huberman Protocol',
  },
] as const;
