import { AccessibilityInfo } from 'react-native';
import { FOCUS_VIEW_POSITION } from './scrollToIndexFallback';
import {
  HIGHLIGHT_PREPAINT_MS,
  RENDER_WINDOW_NUDGE_PX,
} from './focusHabitRequest.constants';
import type {
  FocusRequestActions,
  FocusRequestContext,
} from './focusHabitRequest.types';

export function createFocusRequestActions(
  context: FocusRequestContext
): FocusRequestActions {
  const { habitId, habitName, handledRef, index, latest, progress, timers } =
    context;
  const finishRequest = () => {
    if (handledRef.current === habitId) return;
    handledRef.current = habitId;
    if (latest.current.isLibraryOpen) latest.current.closeLibrary();
    latest.current.clearPendingFocusHabit();
  };
  const scrollToTarget = () => {
    try {
      latest.current.listRef.current?.scrollToIndex({
        animated: false,
        index,
        viewPosition: FOCUS_VIEW_POSITION,
      });
    } catch {
      // onScrollToIndexFailed owns recovery when the target frame is absent.
    }
  };
  const fixNegativeOffset = () => {
    const y = latest.current.getScrollOffset?.() ?? 0;
    if (y < -0.5) {
      latest.current.listRef.current?.scrollToOffset({
        animated: false,
        offset: 0,
      });
    }
  };
  const nudgeRenderWindow = () => {
    const y = latest.current.getScrollOffset?.();
    if (y == null || !Number.isFinite(y)) return;
    latest.current.listRef.current?.scrollToOffset({
      animated: false,
      offset: Math.max(0, y - RENDER_WINDOW_NUDGE_PX),
    });
    latest.current.listRef.current?.recordInteraction();
  };
  const placeAndHighlight = (relock = true) => {
    if (relock) {
      scrollToTarget();
      latest.current.listRef.current?.recordInteraction();
    }
    fixNegativeOffset();
    progress.highlightedAt = Date.now();
    latest.current.setJustCreatedHabitId(habitId);
    AccessibilityInfo.announceForAccessibility(
      `${habitName} added. Showing it in your habits.`
    );
    timers.push(setTimeout(finishRequest, HIGHLIGHT_PREPAINT_MS));
  };
  return {
    finishRequest,
    nudgeRenderWindow,
    placeAndHighlight,
    scrollToTarget,
  };
}
