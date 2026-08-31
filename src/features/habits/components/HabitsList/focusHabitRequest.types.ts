import type { MutableRefObject, RefObject } from 'react';
import type { FlatList } from 'react-native-gesture-handler';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';

export interface UseFocusHabitRequestOptions {
  autoClose: boolean;
  clearPendingFocusHabit: () => void;
  closeLibrary: () => void;
  focusReady: boolean;
  /** Timestamp of the last scroll fallback (0 = never). */
  fallbackAtRef?: RefObject<number>;
  /** Current list contentOffset.y, read before revealing the target region. */
  getScrollOffset?: () => number;
  habits: Habit[];
  /** True only after the target row and adjacent rows report native layout. */
  isFocusNeighborhoodReady?: (targetIndex: number) => boolean;
  isLibraryOpen: boolean;
  listRef: RefObject<FlatList<Habit> | null>;
  pendingFocusHabitId: Id<'habits'> | null;
  onFocusReady: (id: Id<'habits'>) => void;
  reduceMotion: boolean;
  setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
}

export interface RequestProgress {
  highlightedAt: number | null;
  id: Id<'habits'>;
  startedAt: number;
}

export type FocusTimer = ReturnType<typeof setTimeout>;

export interface FocusRequestContext {
  habitId: Id<'habits'>;
  habitName: string;
  handledRef: MutableRefObject<Id<'habits'> | null>;
  index: number;
  latest: MutableRefObject<UseFocusHabitRequestOptions>;
  progress: RequestProgress;
  timers: FocusTimer[];
}

export interface FocusRequestActions {
  finishRequest: () => void;
  nudgeRenderWindow: () => void;
  placeAndHighlight: (relock?: boolean) => void;
  scrollToTarget: () => void;
}
