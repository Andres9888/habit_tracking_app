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

import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import DraggableFlatList, {
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import {
  renderHabitsListHeader,
  renderHabitRow,
} from './HabitsListRenders';
import { HabitsListModals } from './HabitsListModals';
import { StickyHeaderContext } from '../../../../components/CalendarTimeline/StickyHeaderContext';
import { useStickyHeader } from './useStickyHeader';
import { HabitsEmptyState } from '../HabitsEmptyState';
import type { Habit } from '../../types';
import type { HabitsListContentProps } from './HabitsList.types';

export function HabitsListContent({
  props,
  state,
  handlers,
  renderItem,
}: HabitsListContentProps) {
  const {
    list,
    modals,
    upgradePromptVisible,
    onUpgradeDismiss,
    onUpgradeConfirm,
  } = props;

  const stickyEnabled = props.modals.settings?.stickyCalendarHeader ?? false;
  const { scrollHandler, contextValue } = useStickyHeader(stickyEnabled);
  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: list.contentPadding.paddingBottom,
      paddingHorizontal: list.contentPadding.paddingHorizontal,
      paddingTop: 0,
    }),
    [
      list.contentPadding.paddingBottom,
      list.contentPadding.paddingHorizontal,
    ]
  );

  const listHeaderComponent = useMemo(
    () => renderHabitsListHeader({ handlers, props, state }),
    [handlers, props, state]
  );

  const listEmptyComponent = useMemo(() => {
    if (list.isHabitsLoading) return null;
    return <HabitsEmptyState onCreate={() => props.onCreateHabitRequest()} />;
  }, [list.isHabitsLoading, props]);

  const renderHabitItem = useCallback(
    (p: RenderItemParams<Habit>) =>
      renderHabitRow({
        habitRowOpacity: state.habitRowOpacity,
        habitRowTranslateY: state.habitRowTranslateY,
        item: p.item,
        justCreatedHabitId: state.justCreatedHabitId,
        renderItem,
        renderParams: p,
      }),
    [
      state.habitRowOpacity,
      state.habitRowTranslateY,
      state.justCreatedHabitId,
      renderItem,
    ]
  );

  return (
    <StickyHeaderContext.Provider value={contextValue}>
      <View className='flex-1 bg-transparent'>
        {stickyEnabled ? listHeaderComponent : null}
        <View style={{ flex: 1, overflow: 'hidden' }}>
          <DraggableFlatList<Habit>
            ListHeaderComponent={
              stickyEnabled ? undefined : (
                <View
                  style={{
                    marginHorizontal: -(
                      list.contentPadding.paddingHorizontal ?? 0
                    ),
                  }}
                >
                  {listHeaderComponent}
                </View>
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
            keyExtractor={handlers.keyExtractor}
            ListEmptyComponent={listEmptyComponent}
            renderItem={renderHabitItem}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onDragBegin={handlers.handleDragBegin}
            onDragEnd={(params) => {
              void list.handleDragEnd(params);
            }}
            onScroll={scrollHandler}
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
export { type HabitsListContentProps } from './HabitsList.types';
