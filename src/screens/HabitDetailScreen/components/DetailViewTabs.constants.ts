/** DetailViewTabs layout + animation constants. */
import { Easing } from 'react-native-reanimated';
import type { DetailView } from './DetailViewTabButton';

export const PADDING = 3;

/**
 * Off-grid track insets tuned to seat the sticky pill above the section
 * stack. Bottom inset absorbs the 2px lost when the track border was removed
 * so the sticky-header height (and scrollspy offsets) stay unchanged.
 */
export const TRACK_PADDING_TOP = 6;
export const TRACK_PADDING_BOTTOM = 12;

// Chain Day: two anchors only — Goal folds into the scroll as a card, no tab.
export const TABS: Array<{ label: string; view: DetailView }> = [
  { label: 'Strength', view: 'strength' },
  { label: 'Calendar', view: 'calendar' },
];

export const INDICATOR_TIMING = {
  duration: 280,
  easing: Easing.out(Easing.cubic),
};
