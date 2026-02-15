/**
 * Type definitions for AffirmationsSection
 * Positive self-talk cards for daily reinforcement
 */

import type { LucideIcon } from 'lucide-react-native';

import type { AffirmationScheduleData } from '../AffirmationScheduleModal/types';

// Affirmation types for categorization
export type AffirmationType = 'identity' | 'motivational' | 'instructional';

// Frequency types for scheduled delivery
export type AffirmationFrequency = 'daily' | 'weekly';

export interface AffirmationData {
  id: string;
  text: string;
  type?: AffirmationType;
  createdAt: number;
  // Scheduled delivery fields (premium)
  scheduledTime?: string; // "HH:MM" 24-hour format
  frequency?: AffirmationFrequency;
  daysOfWeek?: number[];
  isScheduleEnabled?: boolean;
}

export interface AffirmationScheduleConfig {
  scheduledTime?: string;
  frequency: AffirmationFrequency;
  daysOfWeek?: number[];
  isScheduleEnabled: boolean;
}

export interface AffirmationsSectionProps {
  /** List of existing affirmations */
  affirmations: AffirmationData[];
  /** Number of affirmations (for analytics and gating) */
  affirmationCount: number;
  /** Whether user has premium access */
  isPremium: boolean;
  /** Callback when a new affirmation is saved */
  onSaveAffirmation: (text: string, type?: AffirmationType) => Promise<void>;
  /** Callback when an affirmation is updated */
  onUpdateAffirmation: (
    id: string,
    text: string,
    type?: AffirmationType
  ) => Promise<void>;
  /** Callback when an affirmation is deleted */
  onDeleteAffirmation: (id: string) => Promise<void>;
  /** Callback when schedule is configured (premium) */
  onScheduleAffirmation?: (
    id: string,
    schedule: AffirmationScheduleData
  ) => Promise<void>;
  /** Callback when schedule is cancelled */
  onCancelSchedule?: (id: string) => Promise<void>;
  /** Callback for AI generation (premium) */
  onGenerateAffirmations?: () => Promise<void>;
  /** Whether AI generation is in progress */
  isGenerating?: boolean;
  /** Whether habit has context for better AI generation (why, identity, viz) */
  hasHabitContext?: boolean;
  /** Callback when user hits premium limit */
  onPremiumRequired: () => void;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}

// Type configuration for styling and labels
export interface TypeConfigItem {
  label: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  selectedBg: string;
}

export type TypeConfig = Record<AffirmationType, TypeConfigItem>;
