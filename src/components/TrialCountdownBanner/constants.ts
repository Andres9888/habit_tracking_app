/**
 * TrialCountdownBanner Constants
 * Urgency-based color schemes for light and dark modes
 */

export type UrgencyLevel = 'high' | 'medium' | 'low';

export interface UrgencyColors {
  background: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  icon: string;
  iconBg: string;
  text: string;
  subtext: string;
}

/** Light mode urgency colors */
export const LIGHT_URGENCY: Record<UrgencyLevel, UrgencyColors> = {
  high: {
    background: '#FEF2F2',
    border: '#FECACA',
    buttonBg: '#DC2626',
    buttonText: '#FFFFFF',
    icon: '⏰',
    iconBg: '#FEE2E2',
    text: '#991B1B',
    subtext: '#B91C1C',
  },
  medium: {
    background: '#FFFBEB',
    border: '#FDE68A',
    buttonBg: '#D97706',
    buttonText: '#FFFFFF',
    icon: '⏳',
    iconBg: '#FEF3C7',
    text: '#92400E',
    subtext: '#B45309',
  },
  low: {
    background: '#F5F3FF',
    border: '#DDD6FE',
    buttonBg: '#7C3AED',
    buttonText: '#FFFFFF',
    icon: '✨',
    iconBg: '#EDE9FE',
    text: '#5B21B6',
    subtext: '#6D28D9',
  },
};

/** Dark mode urgency colors */
export const DARK_URGENCY: Record<UrgencyLevel, UrgencyColors> = {
  high: {
    background: '#1C1012',
    border: '#7F1D1D',
    buttonBg: '#EF4444',
    buttonText: '#FFFFFF',
    icon: '⏰',
    iconBg: '#450A0A',
    text: '#FCA5A5',
    subtext: '#F87171',
  },
  medium: {
    background: '#1A1508',
    border: '#78350F',
    buttonBg: '#F59E0B',
    buttonText: '#1A1816',
    icon: '⏳',
    iconBg: '#451A03',
    text: '#FCD34D',
    subtext: '#FBBF24',
  },
  low: {
    background: '#13111C',
    border: '#4C1D95',
    buttonBg: '#8B5CF6',
    buttonText: '#FFFFFF',
    icon: '✨',
    iconBg: '#2E1065',
    text: '#C4B5FD',
    subtext: '#A78BFA',
  },
};

export function getUrgencyLevel(daysRemaining: number): UrgencyLevel {
  if (daysRemaining <= 2) return 'high';
  if (daysRemaining <= 4) return 'medium';
  return 'low';
}

export function getTrialMessage(daysRemaining: number): string {
  if (daysRemaining <= 0) return 'Your free trial has ended';
  if (daysRemaining === 1) return 'Last day of your free trial';
  return `${daysRemaining} days left in your free trial`;
}

export function getTrialSubtext(daysRemaining: number): string {
  if (daysRemaining <= 0) return 'Upgrade to keep all your features';
  if (daysRemaining <= 2) return 'Don\'t lose your streak data';
  if (daysRemaining <= 4) return 'Unlock unlimited habits & insights';
  return 'Explore everything Chain Day offers';
}
