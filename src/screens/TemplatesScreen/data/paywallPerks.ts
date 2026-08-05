/**
 * Paywall Perks - Benefit items shown in the paywall sheet
 */

export interface PaywallPerk {
  emoji: string;
  iconBg: string;
  label: string;
}

export const PAYWALL_PERKS: PaywallPerk[] = [
  {
    emoji: '♾️',
    iconBg: '#ECFDF5',
    label: 'Unlimited habit tracking',
  },
  {
    emoji: '📦',
    iconBg: '#F3E8FF',
    label: 'Premium habit packs',
  },
  {
    emoji: '📊',
    iconBg: '#DBEAFE',
    label: 'Advanced analytics & insights',
  },
  {
    emoji: '🎨',
    iconBg: '#FEF3C7',
    label: 'Custom icons & themes',
  },
  {
    emoji: '🔔',
    iconBg: '#FCE7F3',
    label: 'Smart reminders',
  },
];
