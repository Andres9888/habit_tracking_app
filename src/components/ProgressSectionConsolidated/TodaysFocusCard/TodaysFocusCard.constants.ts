/**
 * TodaysFocusCard Constants
 *
 * Animation timings, colors, and focus state configurations.
 */

import {
  CheckCircle2,
  Crosshair,
  Heart,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react-native';

import { colors as themeTokens, overlays } from '@/theme/colors';
import { focusStateGradients } from '@/theme/colors/focusStates';
import type { FocusState, FocusStateConfig } from '../TodaysFocusCardTypes';

/** Animation timing constants */
export const ENTRANCE_DURATION = 300;
export const SHIMMER_DURATION = 2500;
export const NUMBER_COUNT_DURATION = 800;
export const CONFETTI_DURATION = 700;
export const CONFETTI_PARTICLE_COUNT = 16;

/**
 * Confetti colors - celebratory gold/amber theme with accent colors
 */
export const CONFETTI_COLORS = [
  '#F59E0B', // Amber 500 (primary celebration)
  '#FBBF24', // Amber 400
  '#FCD34D', // Amber 300
  '#D97706', // Amber 600
  '#10B981', // Emerald 500 (success accent)
  '#34D399', // Emerald 400
];

/**
 * Focus state configurations
 * Each state has specific gradient colors, icon, and messaging
 */
export const FOCUS_STATE_CONFIGS: Record<FocusState, FocusStateConfig> = {
  building: {
    getGoalLabel: () => '7 days',
    getMessage: (streak: number) => `${streak} days strong - keep going!`,
    gradientColors: focusStateGradients.building,
    icon: TrendingUp,
    iconColor: themeTokens.text.inverse,
    subTextColor: overlays.subTextOnHero,
    textColor: themeTokens.text.inverse,
  },
  celebrating: {
    getGoalLabel: () => 'next',
    getMessage: (milestone: number) => `🎉 You hit ${milestone} days!`,
    gradientColors: focusStateGradients.celebrating,
    icon: Trophy,
    iconColor: themeTokens.text.inverse,
    subTextColor: overlays.subTextOnHero,
    textColor: themeTokens.text.inverse,
  },
  completed: {
    getGoalLabel: () => '🔥',
    getMessage: (streak: number) => `${streak} day streak and counting!`,
    gradientColors: focusStateGradients.completed,
    icon: CheckCircle2,
    iconColor: themeTokens.text.inverse,
    subTextColor: overlays.subTextOnHero,
    textColor: themeTokens.text.inverse,
  },
  recovering: {
    getGoalLabel: () => 'best streak',
    getMessage: (bestStreak: number) =>
      `You've done ${bestStreak} before. Do it again!`,
    gradientColors: focusStateGradients.recovering,
    icon: RefreshCw,
    iconColor: themeTokens.text.inverse,
    subTextColor: overlays.subTextOnHero,
    textColor: themeTokens.text.inverse,
  },
  starting: {
    getGoalLabel: () => '3 days',
    getMessage: () => '3 days unlocks momentum!',
    gradientColors: focusStateGradients.starting,
    icon: Sparkles,
    iconColor: themeTokens.text.inverse,
    subTextColor: overlays.subTextOnHero,
    textColor: themeTokens.text.inverse,
  },
  struggling: {
    getGoalLabel: () => '1 day',
    getMessage: () => 'Every day is a fresh start!',
    gradientColors: focusStateGradients.struggling,
    icon: Heart,
    iconColor: themeTokens.text.inverse,
    subTextColor: overlays.subTextOnHero,
    textColor: themeTokens.text.inverse,
  },
  thriving: {
    getGoalLabel: () => 'next milestone',
    getMessage: (goal: number) => `Complete today to hit ${goal} days!`,
    gradientColors: focusStateGradients.thriving,
    icon: Crosshair,
    iconColor: themeTokens.text.inverse,
    subTextColor: overlays.subTextOnHero,
    textColor: themeTokens.text.inverse,
  },
};
