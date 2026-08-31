/* eslint-disable max-lines */
/**
 * HabitsListContent — the actual list body rendered by {@link HabitsList}.
 *
 * Wraps `react-native-draggable-flatlist` and wires up the FlatList
 * render slots (header, empty, item) plus the modal layer.
 *
 * Each render slot is produced by a dedicated factory function (see
 * `HabitsListRenders`) and memoised here to avoid unnecessary re-renders.
 *
 * This component owns no state or side-effects; everything is injected via
 * {@link HabitsListContentProps}.
 */

import { memo, useCallback, useMemo, useRef } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import DraggableFlatList, {
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import { renderHabitsListHeader, renderHabitRow } from './HabitsListRenders';
import { createScrollToIndexFallback } from './scrollToIndexFallback';
import { HabitsListModals } from './HabitsListModals';
import { StickyHeaderContext } from '../../../../components/CalendarTimeline/StickyHeaderContext';
import { useStickyHeader } from './useStickyHeader';
import type { Habit } from '../../types';
import type { HabitsListContentProps } from './HabitsList.types';

/**
 * While a focus request is pending the list is remounted with the target as
 * `initialScrollIndex` (see `useFocusAnchor`). Mounting cards is the expensive
 * part, so keep the window small — it is measured in viewports — and mount the
 * target region in one batch.
 */
const FOCUS_LIST_PERF = {
  initialNumToRender: 4,
  maxToRenderPerBatch: 16,
  updateCellsBatchingPeriod: 8,
  windowSize: 3,
} as const;

/** Where the list should mount for the current focus request, if any. */
interface FocusAnchor {
  estimatedRowLength: number;
  key: string;
  index: number;
}

const HeaderWrapper = memo(function HeaderWrapper({
  children,
  style,
}: {
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
}) {
  return <View style={style}>{children}</View>;
});

/*
 * No `maintainVisibleContentPosition`: on Fabric it re-anchors the content
 * natively without a JS scroll event, which left VirtualizedList's render
 * window stranded around the focus remount's initial region (an unmounted
 * hole under the target, sim-verified).
 */

export function HabitsListContent({
  deferHeavyFocusContent,
  focusEstimatedRowLength,
  props,
  state,
  handlers,
  listRef,
  onHabitRowLayout,
  onScrollToIndexFallback,
  renderItem,
  scrollY,
}: HabitsListContentProps) {
  const {
    list,
    modals,
    upgradePromptVisible,
    onUpgradeDismiss,
    onUpgradeConfirm,
  } = props;

  const stickyEnabled = props.modals.settings?.stickyCalendarHeader ?? false;
  const focusAnchor = useFocusAnchor(
    props.modals.pendingFocusHabitId,
    list.habits,
    focusEstimatedRowLength
  );
  // The anchor intentionally outlives the request. Keep only its mount
  // geometry after reveal; dropping getItemLayout during the modal exit makes
  // a far list re-anchor toward row zero before the ring is visible. The
  // smaller render window is temporary and must not retune ordinary scrolling
  // after the request clears.
  const focusGeometryRetained = focusAnchor != null;
  const focusRequestPending = props.modals.pendingFocusHabitId != null;
  const focusPerf = focusRequestPending ? FOCUS_LIST_PERF : undefined;
  const { scrollHandler, contextValue } = useStickyHeader(
    stickyEnabled,
    scrollY
  );
  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: list.contentPadding.paddingBottom,
      paddingHorizontal: list.contentPadding.paddingHorizontal,
      paddingTop: 0,
    }),
    [list.contentPadding.paddingBottom, list.contentPadding.paddingHorizontal]
  );

  const headerWrapperStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      marginHorizontal: -(list.contentPadding.paddingHorizontal ?? 0),
    }),
    [list.contentPadding.paddingHorizontal]
  );

  const handleScrollToIndexFailed = useMemo(
    () => createScrollToIndexFallback(listRef, onScrollToIndexFallback),
    [listRef, onScrollToIndexFallback]
  );
  const getFocusedItemLayout = useCallback(
    (_data: ArrayLike<Habit> | null | undefined, index: number) => {
      const length = focusAnchor?.estimatedRowLength ?? 0;
      return { index, length, offset: length * index };
    },
    [focusAnchor]
  );

  const listHeaderComponent = useMemo(
    () => renderHabitsListHeader({ handlers, props, state }),
    [handlers, props, state]
  );

  // Mounted cells re-render only when this changes identity. It must carry
  // both per-row inputs that can change on an already-mounted card — the
  // highlight target and the shell→full readiness flip — and nothing else,
  // so unrelated renders keep cell memoization intact.
  const extraData = useMemo(
    () => ({
      deferHeavyFocusContent,
      justCreatedHabitId: state.justCreatedHabitId,
    }),
    [deferHeavyFocusContent, state.justCreatedHabitId]
  );

  const renderHabitItem = useCallback(
    (p: RenderItemParams<Habit>) =>
      renderHabitRow({
        habitRowOpacity: state.habitRowOpacity,
        habitRowTranslateY: state.habitRowTranslateY,
        initialEntranceDoneRef: state.initialEntranceDoneRef,
        item: p.item,
        justCreatedHabitId: state.justCreatedHabitId,
        onHabitRowLayout,
        renderItem,
        renderParams: p,
      }),
    [
      state.habitRowOpacity,
      state.habitRowTranslateY,
      state.initialEntranceDoneRef,
      state.justCreatedHabitId,
      onHabitRowLayout,
      renderItem,
    ]
  );

  return (
    <StickyHeaderContext.Provider value={contextValue}>
      <View className='flex-1 bg-transparent'>
        {stickyEnabled ? listHeaderComponent : null}
        <View style={{ flex: 1, overflow: 'hidden' }}>
          <DraggableFlatList<Habit>
            // Normal scrolling remains variable-height. For a focus request,
            // the measured row-length estimate lets initialScrollIndex mount
            // a contiguous target region directly behind the library modal;
            // native row layouts still gate when that region may be revealed.
            // (No maintainVisibleContentPosition here: it bumps RN's
            // pendingScrollUpdateCount on every data update and freezes the
            // render window until scroll events drain it — a hole.)
            key={focusAnchor?.key ?? 'habits'}
            ref={listRef}
            ListHeaderComponent={
              stickyEnabled ? undefined : (
                <HeaderWrapper style={headerWrapperStyle}>
                  {listHeaderComponent}
                </HeaderWrapper>
              )
            }
            activationDistance={
              props.isSelectionMode
                ? 9999
                : handlers.isReorderingEnabled
                  ? 12
                  : 9999
            }
            contentContainerStyle={contentContainerStyle}
            data={list.habits}
            // DraggableFlatList memoises mounted rows and only re-renders them
            // when extraData changes; the focus/just-created highlight and the
            // deferHeavyContent readiness flip are per-row state that must
            // reach an already-mounted card.
            extraData={extraData}
            getItemLayout={
              focusGeometryRetained ? getFocusedItemLayout : undefined
            }
            initialScrollIndex={focusAnchor?.index}
            initialNumToRender={6}
            keyExtractor={handlers.keyExtractor}
            maxToRenderPerBatch={6}
            removeClippedSubviews
            renderItem={renderHabitItem}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            updateCellsBatchingPeriod={32}
            windowSize={5}
            {...focusPerf}
            onDragBegin={handlers.handleDragBegin}
            onDragEnd={(params) => {
              void list.handleDragEnd(params);
            }}
            onScroll={scrollHandler}
            onScrollToIndexFailed={handleScrollToIndexFailed}
          />
        </View>
        <HabitsListModals
          daySheetDate={state.daySheetDate}
          getHabitStatus={list.getHabitStatus}
          habits={list.habits}
          reduceMotion={list.reduceMotionPreference}
          toggleHabit={list.toggleHabit}
          upgradePromptVisible={upgradePromptVisible}
          onCloseDaySheet={state.closeDaySheet}
          onUpgradeConfirm={onUpgradeConfirm}
          onUpgradeDismiss={onUpgradeDismiss}
        />
      </View>
    </StickyHeaderContext.Provider>
  );
}

/**
 * One anchor per focus request, fixed the moment the target row exists in
 * `habits`. It never changes afterwards (so later reorders or the request
 * clearing do not remount the list again) until the next request arrives.
 */
function useFocusAnchor(
  pendingFocusHabitId: string | null,
  habits: Habit[],
  focusEstimatedRowLength: number
): FocusAnchor | null {
  const anchorRef = useRef<FocusAnchor | null>(null);
  if (pendingFocusHabitId && anchorRef.current?.key !== pendingFocusHabitId) {
    const index = habits.findIndex((h) => h._id === pendingFocusHabitId);
    if (index >= 0) {
      anchorRef.current = {
        estimatedRowLength: focusEstimatedRowLength,
        index,
        key: pendingFocusHabitId,
      };
    }
  }
  return anchorRef.current;
}

export { type HabitsListContentProps } from './HabitsList.types';
