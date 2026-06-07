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

import { memo, useCallback, useMemo } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import DraggableFlatList, {
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import { renderHabitsListHeader, renderHabitRow } from './HabitsListRenders';
import { HabitsListModals } from './HabitsListModals';
import { StickyHeaderContext } from '../../../../components/CalendarTimeline/StickyHeaderContext';
import { useStickyHeader } from './useStickyHeader';
import type { Habit } from '../../types';
import type { HabitsListContentProps } from './HabitsList.types';

const REMOVE_CLIPPED_SUBVIEWS = Platform.OS === 'android';
const INITIAL_HABITS_TO_RENDER = 12;
const HABITS_TO_RENDER_PER_BATCH = 12;
const HABITS_BATCHING_PERIOD_MS = 16;
const HABITS_WINDOW_SIZE = 11;

const HeaderWrapper = memo(function HeaderWrapper({
  children,
  style,
}: {
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
}) {
  return <View style={style}>{children}</View>;
});

export function HabitsListContent({
  props,
  state,
  handlers,
  renderItem,
}: HabitsListContentProps) {
  const { list, upgradePromptVisible, onUpgradeDismiss, onUpgradeConfirm } =
    props;

  const stickyEnabled = props.modals.settings?.stickyCalendarHeader ?? false;
  const { scrollHandler, contextValue } = useStickyHeader(stickyEnabled);
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

  const listHeaderComponent = useMemo(
    () => renderHabitsListHeader({ handlers, props, state }),
    [handlers, props, state]
  );

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
            initialNumToRender={INITIAL_HABITS_TO_RENDER}
            keyExtractor={handlers.keyExtractor}
            maxToRenderPerBatch={HABITS_TO_RENDER_PER_BATCH}
            removeClippedSubviews={REMOVE_CLIPPED_SUBVIEWS}
            renderItem={renderHabitItem}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            updateCellsBatchingPeriod={HABITS_BATCHING_PERIOD_MS}
            windowSize={HABITS_WINDOW_SIZE}
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
