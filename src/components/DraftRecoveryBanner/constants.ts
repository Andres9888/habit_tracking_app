export const VARIANT_STYLES = {
  emerald: {
    bg: '',
    border: '',
    buttonBg: '',
    buttonText: '',
    iconBg: '',
    iconColor: '#059669',
    text: '',
    useTheme: 'success' as const,
  },
  rose: {
    bg: '',
    border: '',
    buttonBg: '',
    buttonText: '',
    iconBg: '',
    iconColor: '#DC2626',
    text: '',
    useTheme: 'error' as const,
  },
  violet: {
    bg: '',
    border: '',
    buttonBg: '',
    buttonText: '',
    iconBg: '',
    iconColor: '#7c3aed',
    text: '',
    useTheme: true as const,
  },
} as const;

export type VariantKey = keyof typeof VARIANT_STYLES;
