import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {
  renderHabitsListHeader,
  renderHabitsListFooter,
  renderHabitsListEmpty,
  renderHabitRow,
} from './HabitsListRenders';
import { HabitsListModals } from './HabitsListModals';
import type { Habit } from '../../types';
import type { HabitsListContentProps } from './HabitsList.types';

export function HabitsListContent({
  props,
  state,
  handlers,
  renderItem,
  handleSuccessTransitionComplete,
}: HabitsListContentProps) {
  const { list, modals, onUpgradeIntent } = props;
  const { upgradePromptVisible, onUpgradeDismiss, onUpgradeConfirm } = props;

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: list.contentPadding.paddingBottom,
      paddingHorizontal: list.contentPadding.paddingHorizontal,
      paddingTop: 0,
    }),
    [list.contentPadding.paddingBottom, list.contentPadding.paddingHorizontal]
  );

  const listEmptyComponent = useMemo(
    () =>
      renderHabitsListEmpty({
        handlers,
        list,
        modals,
        onTransitionComplete: handleSuccessTransitionComplete,
      }),
    [handlers, list, modals, handleSuccessTransitionComplete]
  );

  const listFooterComponent = useMemo(
    () => renderHabitsListFooter({ list, onUpgradeIntent }),
    [list, onUpgradeIntent]
  );

  const listHeaderComponent = useMemo(
    () => renderHabitsListHeader({ handlers, props, state }),
    [handlers, props, state]
  );

  const renderHabitItem = useCallback(
    (p: any) =>
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
    <View className='flex-1 bg-transparent'>
      <DraggableFlatList<Habit>
        activationDistance={handlers.isReorderingEnabled ? 12 : 9999}
        contentContainerStyle={contentContainerStyle}
        data={list.habits}
        keyExtractor={handlers.keyExtractor}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={listFooterComponent}
        ListHeaderComponent={listHeaderComponent}
        renderItem={renderHabitItem}
        showsVerticalScrollIndicator={false}
        onDragBegin={handlers.handleDragBegin}
        onDragEnd={list.handleDragEnd}
      />
      <HabitsListModals
        handlers={handlers}
        list={list}
        state={state}
        upgradePromptVisible={upgradePromptVisible}
        onUpgradeConfirm={onUpgradeConfirm}
        onUpgradeDismiss={onUpgradeDismiss}
      />
    </View>
  );
}

export { type HabitsListContentProps } from './HabitsList.types';
