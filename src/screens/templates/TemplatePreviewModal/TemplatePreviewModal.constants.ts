/**
 * Local animation constants for the TemplatePreviewModal
 */

import { Easing, FadeInUp } from 'react-native-reanimated';

/** Staggered entrance animation for sheet sections */
export const entrance = (delay: number) =>
  FadeInUp.delay(delay).duration(280).easing(Easing.out(Easing.cubic));
