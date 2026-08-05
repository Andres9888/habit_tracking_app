/**
 * Types for HeroSection
 */

import type { ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';

export interface HeroSectionProps {
  template: Doc<'templates'>;
  iconAnimatedStyle: AnimatedStyle<ViewStyle>;
}
