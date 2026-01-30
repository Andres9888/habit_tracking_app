/**
 * Type definitions for ShareCardGenerator component
 */

export type SharePlatform =
  | 'instagram-story'
  | 'instagram-feed'
  | 'twitter'
  | 'facebook';

export interface ShareFormat {
  width: number;
  height: number;
  aspectRatio: number;
}

export type MilestoneLevel =
  | 'starting'
  | 'building'
  | 'developing'
  | 'strong'
  | 'automatic';

export interface MilestoneConfig {
  emoji: string;
  label: string;
  range: string;
}

export interface GradientPreset {
  name: string;
  colors: string[];
}

export interface ShareCardData {
  habitName: string;
  milestoneLevel: MilestoneLevel;
  strengthPercentage: number;
  userName?: string;
}

export interface ShareCardGeneratorProps {
  visible: boolean;
  onClose: () => void;
  data: ShareCardData;
}

export interface ShareCardState {
  selectedGradient: number;
  personalMessage: string;
  showUserName: boolean;
  selectedPlatform: SharePlatform;
  isGenerating: boolean;
}

export interface ShareCardContentProps {
  habitName: string;
  emoji: string;
  milestoneLabel: string;
  strengthPercentage: number;
  personalMessage?: string;
  showUserName: boolean;
  userName?: string;
}
