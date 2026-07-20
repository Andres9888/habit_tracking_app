/**
 * Types for ScrollableContent
 */

import type { LayoutChangeEvent, ViewStyle } from 'react-native';
import type { SharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import type { TemplatePreviewAnchor } from '@/screens/TemplatesScreen/TemplatesScreen.types';
import type { Template } from '../../../types/template';

export interface ScrollableContentProps {
  template: Template;
  iconColor: string;
  iconAnimatedStyle: ViewStyle;
  iconGlowStyle: ViewStyle;
  initialAnchor?: TemplatePreviewAnchor;
  overscrollTint?: string;
  scrollHandler?: ReturnType<typeof useAnimatedScrollHandler>;
  scrollY: SharedValue<number>;
  visible?: boolean;
  onHeroLayout?: (event: LayoutChangeEvent) => void;
}
