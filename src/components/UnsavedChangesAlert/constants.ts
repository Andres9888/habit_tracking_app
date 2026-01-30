export const VARIANT_STYLES = {
  amber: {
    discardBg: 'bg-amber-500',
    discardText: 'text-white',
    iconBg: 'bg-amber-100',
    iconColor: '#d97706',
    previewBg: 'bg-amber-50',
    previewBorder: 'border-amber-200',
  },
  rose: {
    discardBg: 'bg-rose-500',
    discardText: 'text-white',
    iconBg: 'bg-rose-100',
    iconColor: '#e11d48',
    previewBg: 'bg-rose-50',
    previewBorder: 'border-rose-200',
  },
} as const;

export type VariantKey = keyof typeof VARIANT_STYLES;
