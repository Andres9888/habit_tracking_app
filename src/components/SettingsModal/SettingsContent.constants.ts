import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { durations, enterEasing } from '@/theme/animations';
import { FadeInDown } from 'react-native-reanimated';

export const STAGGER = durations.stagger;
export const MAX_STAGGER_ITEMS = 6;

export const sectionEnterAnim = (index: number) =>
  FadeInDown.delay(Math.min(index, MAX_STAGGER_ITEMS) * STAGGER)
    .duration(durations.enter)
    .easing(enterEasing);

export const SCROLL_STYLES = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
});

export const fullScreenModalStyle: ViewStyle = {
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
};
