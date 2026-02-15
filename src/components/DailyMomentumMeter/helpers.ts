
import { Zap, Target, Trophy, Sparkles, Flame } from 'lucide-react-native';

import type { ProgressColors, MotivationalMessage } from './types';

export function getProgressColors(percentage: number): ProgressColors {
  if (percentage === 100) {
    return { bg: '#dcfce7', fill: '#10b981', glow: '#10b981', text: '#047857' };
  }
  if (percentage >= 80) {
    return { bg: '#dcfce7', fill: '#22c55e', glow: '#22c55e', text: '#15803d' };
  }
  if (percentage >= 60) {
    return { bg: '#fef9c3', fill: '#eab308', glow: '#eab308', text: '#a16207' };
  }
  if (percentage >= 40) {
    return { bg: '#ffedd5', fill: '#f97316', glow: '#f97316', text: '#c2410c' };
  }
  return { bg: '#fee2e2', fill: '#ef4444', glow: '#ef4444', text: '#b91c1c' };
}

export function getMessage(percentage: number): MotivationalMessage {
  if (percentage === 100) {
    return { emoji: '🏆', icon: Trophy, text: 'Perfect Day!' };
  }
  if (percentage >= 80) {
    return { emoji: '✨', icon: Sparkles, text: 'Almost there!' };
  }
  if (percentage >= 60) {
    return { emoji: '⚡', icon: Zap, text: 'Great progress' };
  }
  if (percentage >= 40) {
    return { emoji: '🎯', icon: Target, text: 'Keep going' };
  }
  if (percentage > 0) {
    return { emoji: '🔥', icon: Flame, text: 'Getting started' };
  }
  return { emoji: '🌅', icon: Target, text: 'Start your day' };
}
