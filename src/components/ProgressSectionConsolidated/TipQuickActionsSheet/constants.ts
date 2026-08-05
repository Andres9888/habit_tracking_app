/**
 * TipQuickActionsSheet Constants
 */

import { Bell, Edit3, Calendar, Target, Heart, Zap } from 'lucide-react-native';
import type { QuickAction } from './types';

/**
 * Icon mapping for quick actions
 */
export const ICON_MAP = {
  bell: Bell,
  calendar: Calendar,
  'edit-3': Edit3,
  heart: Heart,
  target: Target,
  zap: Zap,
} as const;

/**
 * Icon colors based on action type
 */
export const ACTION_COLORS: Record<
  QuickAction['actionType'],
  { icon: string; bg: string }
> = {
  celebrate: { bg: '#fef9c3', icon: '#ca8a04' },
  editHabit: { bg: '#cffafe', icon: '#0891b2' },
  makeSmaller: { bg: '#ffedd5', icon: '#ea580c' },
  reviewWhy: { bg: '#fee2e2', icon: '#dc2626' },
  setReminder: { bg: '#ede9fe', icon: '#7c3aed' },
  viewHistory: { bg: '#d1fae5', icon: '#059669' },
};
