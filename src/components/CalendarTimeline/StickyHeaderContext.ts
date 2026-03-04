/**
 * StickyHeaderContext — shares scroll-driven sticky progress
 * with deeply nested components (HabitsListHeader, CalendarTimeline).
 *
 * stickyProgress is a Reanimated SharedValue: 0 = normal, 1 = sticky.
 */

import { createContext, useContext } from 'react';
import { makeMutable } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export interface StickyHeaderContextValue {
  stickyProgress: SharedValue<number>;
}

const DEFAULT: StickyHeaderContextValue = {
  stickyProgress: makeMutable(0),
};

export const StickyHeaderContext =
  createContext<StickyHeaderContextValue>(DEFAULT);

export const useStickyProgress = () =>
  useContext(StickyHeaderContext).stickyProgress;
