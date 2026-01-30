export const VARIANT_STYLES = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    buttonBg: 'bg-emerald-100',
    buttonText: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
    iconColor: '#059669',
    text: 'text-emerald-800',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    buttonBg: 'bg-rose-100',
    buttonText: 'text-rose-700',
    iconBg: 'bg-rose-100',
    iconColor: '#e11d48',
    text: 'text-rose-800',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    buttonBg: 'bg-violet-100',
    buttonText: 'text-violet-700',
    iconBg: 'bg-violet-100',
    iconColor: '#7c3aed',
    text: 'text-violet-800',
  },
} as const;

export type VariantKey = keyof typeof VARIANT_STYLES;
