/** Serif title for Settings SUB-PAGES (Account, Calendar look).
 *
 *  The Settings root header is editorial — "CHAIN DAY" eyebrow over a serif
 *  title — while ScreenHeader's default is a centred sans title. Drilling one
 *  level in therefore changed the visual grammar completely. This keeps the
 *  serif, which is the brand, one tap deeper. */
import type { TextStyle } from 'react-native';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const settingsScreenHeaderTitle: TextStyle = {
  fontFamily: fontFamilies.serif,
  fontSize: 21,
  fontWeight: fontWeights.bold,
  letterSpacing: -0.3,
};
