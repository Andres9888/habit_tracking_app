/**
 * Internal type definitions for CelebrationScreen sub-components
 */

import type React from 'react';

export interface AnimatedContentProps {
  children: React.ReactNode;
  index: number;
  visible: boolean;
  reduceMotion?: boolean;
}

export interface ConfettiParticleProps {
  color: string;
  delay: number;
  angle: number;
  reduceMotion?: boolean;
}

export interface CelebrationHeaderProps {
  habitName: string;
  isStreakMilestone?: boolean;
  milestoneNumber?: number;
  reduceMotion?: boolean;
}

export interface StreakDisplayProps {
  streak: number;
  reduceMotion?: boolean;
}

export interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: 'emerald' | 'violet' | 'amber';
}

export interface StatsRowProps {
  completionRate?: number;
  bestStreak?: number;
  totalCompletions?: number;
}

export interface CapturePromptButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onPress: () => void;
  isPremium?: boolean;
}

export interface DoneButtonProps {
  onPress: () => void;
  reduceMotion?: boolean;
}
