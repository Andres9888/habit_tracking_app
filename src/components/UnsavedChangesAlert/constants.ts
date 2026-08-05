export const VARIANT_STYLES = {
  amber: {
    discardBg: '',
    discardText: 'text-white',
    iconBg: '',
    iconColor: '#d97706',
    previewBg: '',
    previewBorder: '',
    useTheme: true,
  },
  rose: {
    discardBg: '',
    discardText: 'text-white',
    iconBg: '',
    iconColor: '#e11d48',
    previewBg: '',
    previewBorder: '',
    useTheme: false,
    useErrorTheme: true,
  },
} as const;

export type VariantKey = keyof typeof VARIANT_STYLES;
