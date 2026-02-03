/**
 * TrialCountdownBanner Styles
 * Dynamic color schemes based on urgency level
 */

type UrgencyLevel = 'high' | 'medium' | 'low';

interface BannerStyles {
  bg: string;
  border: string;
  buttonBg: string;
  iconBg: string;
  iconColor: string;
  text: string;
}

export function getBannerStyles(daysRemaining: number): BannerStyles {
  const urgencyLevel: UrgencyLevel =
    daysRemaining <= 2 ? 'high' : daysRemaining <= 4 ? 'medium' : 'low';

  switch (urgencyLevel) {
    case 'high': {
      return {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        buttonBg: 'bg-rose-600',
        iconBg: 'bg-rose-100',
        iconColor: '#E11D48',
        text: 'text-rose-900',
      };
    }
    case 'medium': {
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        buttonBg: 'bg-amber-600',
        iconBg: 'bg-amber-100',
        iconColor: '#D97706',
        text: 'text-amber-900',
      };
    }
    default: {
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        buttonBg: 'bg-purple-600',
        iconBg: 'bg-purple-100',
        iconColor: '#9333EA',
        text: 'text-purple-900',
      };
    }
  }
}

export function getTrialMessage(daysRemaining: number): string {
  const daysText = daysRemaining === 1 ? 'day' : 'days';
  return `${daysRemaining} ${daysText} left in your free trial`;
}
