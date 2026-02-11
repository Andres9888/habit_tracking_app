/**
 * HabitsListContent - The draggable list of habits
 */

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

  return (
    <View className='flex-1 bg-transparent'>
      <DraggableFlatList
        activationDistance={handlers.isReorderingEnabled ? 12 : 9999}
        contentContainerStyle={{
          paddingBottom: list.contentPadding.paddingBottom,
          paddingHorizontal: list.contentPadding.paddingHorizontal,
          paddingTop: 0,
        }}
        data={list.habits}
        keyExtractor={handlers.keyExtractor}
        ListEmptyComponent={renderHabitsListEmpty({
          handlers,
          list,
          modals,
          onTransitionComplete: handleSuccessTransitionComplete,
        })}
        ListFooterComponent={renderHabitsListFooter({ list, onUpgradeIntent })}
        ListHeaderComponent={renderHabitsListHeader({ handlers, props, state })}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderItem={function renderHabitItem(p: any) {
          return renderHabitRow({
            habitRowOpacity: state.habitRowOpacity,
            habitRowTranslateY: state.habitRowTranslateY,
            item: p.item,
            justCreatedHabitId: state.justCreatedHabitId,
            renderItem,
            renderParams: p,
          });
        }}
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
