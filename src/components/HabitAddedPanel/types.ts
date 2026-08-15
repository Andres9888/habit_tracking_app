/**
 * Types for the shared post-add confirmation panel.
 *
 * Every action is described rather than rendered by the caller so the panel
 * owns the layout contract: one primary pill, one optional quiet link, and
 * nothing else competing at the moment the habit lands.
 */

import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

/**
 * Callers hand in reanimated styles (press scale, entrance transform) as well
 * as plain ones, so every style slot on the panel accepts both.
 */
export type PanelStyle = StyleProp<AnimatedStyle<ViewStyle>>;

export interface HabitAddedPalette {
  addBg: string;
  addedBg: string;
  addedFg: string;
  addFg: string;
  border: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
}

export interface HabitAddedAction {
  /** Spoken after the label — say where the button goes, not what it is. */
  hint?: string;
  label: string;
  /** Animated style from a press-scale hook, when the caller has one. */
  style?: PanelStyle;
  testID?: string;
  /** Press-scale handlers (onPressIn/onPressOut) from the caller. */
  pressHandlers?: object;
  onPress: () => void;
}

export interface HabitAddedPanelProps {
  /** Animated style for the check badge pop. */
  checkStyle?: PanelStyle;
  headline: string;
  /** Set when a caller's test needs to read the headline directly. */
  headlineTestID?: string;
  message: string;
  palette: HabitAddedPalette;
  primary: HabitAddedAction;
  secondary?: HabitAddedAction;
  style?: PanelStyle;
  testID?: string;
}
