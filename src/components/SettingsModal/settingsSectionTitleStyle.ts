/** settingsSectionTitle — one shared type token for both static + collapsible section headers */
import { fontFamilies, fontWeights } from '@/theme/typography';

export const settingsSectionTitle = {
  fontFamily: fontFamilies.serif,
  fontSize: 15.5,
  fontWeight: fontWeights.semibold,
  letterSpacing: -0.1,
} as const;
