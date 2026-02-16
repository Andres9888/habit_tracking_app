/**
 * Type definitions for SharePromptManager
 */

export interface SharePromptManagerProps {
  currentStreak: number;
  habitName: string;
  habitEmoji: string;
  userName?: string;
  onShare: () => void;
}

export interface MilestoneSharePrompt {
  days: number;
  emoji: string;
  title: string;
  message: string;
}

export interface SharePromptTracking {
  lastPromptedMilestone: number | null;
  promptedMilestones: number[];
  lastPromptDate: string | null;
}
