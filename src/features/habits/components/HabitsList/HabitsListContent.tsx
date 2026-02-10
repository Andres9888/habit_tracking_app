/**
 * HabitsListContent - The draggable list of habits
 */

import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { HabitsListModals } from './HabitsListModals';
import {
  renderHabitsListHeader,
  renderHabitsListFooter,
  renderHabitsListEmpty,
  renderHabitRow,
} from './HabitsListRenders';
import type { HabitsListProps } from './HabitsList.types';

export interface HabitsListContentProps {
  props: HabitsListProps;
  state: ReturnType<typeof import('./useHabitsListState').useHabitsListState>;
  handlers: ReturnType<
    typeof import('./useHabitsListHandlers').useHabitsListHandlers
  >;
  renderItem: ReturnType<
    typeof import('../../hooks/useHabitRenderItem').useHabitRenderItem
  >;
  handleSuccessTransitionComplete: () => void;
}

export function HabitsListContent({
  props,
  state,
  handlers,
  renderItem,
  handleSuccessTransitionComplete,
}: HabitsListContentProps) {
  const { list, modals, onUpgradeIntent } = props;
  const { upgradePromptVisible, onUpgradeDismiss, onUpgradeConfirm } = props;

  // Memoize contentContainerStyle to avoid new object reference each render
  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: list.contentPadding.paddingBottom,
      paddingHorizontal: list.contentPadding.paddingHorizontal,
      paddingTop: 0 as const,
    }),
    [list.contentPadding.paddingBottom, list.contentPadding.paddingHorizontal]
  );

  // Memoize renderItem wrapper to prevent DraggableFlatList re-renders
  const wrappedRenderItem = useCallback(
    (p: Parameters<typeof renderItem>[0]) =>
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

  // Memoize list section components to avoid re-creating on every render
  const emptyComponent = useMemo(
    () =>
      renderHabitsListEmpty({
        handlers,
        list,
        modals,
        onTransitionComplete: handleSuccessTransitionComplete,
      }),
    [handlers, list, modals, handleSuccessTransitionComplete]
  );

  const footerComponent = useMemo(
    () => renderHabitsListFooter({ list, onUpgradeIntent }),
    [list, onUpgradeIntent]
  );

  const headerComponent = useMemo(
    () => renderHabitsListHeader({ handlers, props, state }),
    [handlers, props, state]
  );

  return (
    <View className='flex-1 bg-transparent'>
      <DraggableFlatList
        activationDistance={handlers.isReorderingEnabled ? 12 : 9999}
        contentContainerStyle={contentContainerStyle}
        data={list.habits}
        keyExtractor={handlers.keyExtractor}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footerComponent}
        ListHeaderComponent={headerComponent}
        renderItem={wrappedRenderItem}
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
