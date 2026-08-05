/** settingsSectionTitle — one shared type token for both static + collapsible section headers */
import { fontFamilies, fontWeights } from '@/theme/typography';

export const settingsSectionTitle = {
  fontFamily: fontFamilies.serif,
  // Editorial scale, matching the Habit Browser's section headers. At 15.5 the
  // serif read as a slightly-odd list label rather than a deliberate heading.
  fontSize: 19,
  fontWeight: fontWeights.bold,
  letterSpacing: -0.3,
} as const;
