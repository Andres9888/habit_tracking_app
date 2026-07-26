import { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { airy } from '@/theme/airyScale';
import { useArchivedHabitsModalState } from './useArchivedHabitsModalState';
import {
  AnimatedHabitCard,
  ArchiveSelectionBar,
  EmptyState,
  ModalHeader,
} from './components';
import { DangerZoneFooter } from './components/DangerZoneFooter';
import { LoadingState } from './components/LoadingState';
import { showArchivedHabitUpgradeAlert } from './showArchivedHabitUpgradeAlert';
import type { ArchivedHabitsModalProps, ArchivedHabit } from './types';

export default function ArchivedHabitsModal({
  onBack,
}: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const state = useArchivedHabitsModalState();

  const handleUpgradePress = useCallback(showArchivedHabitUpgradeAlert, []);

  const handleSelectPress = useCallback(() => {
    if (state.selectionMode) state.exitSelectionMode();
    else state.enterSelectionMode();
  }, [state]);

  const renderItem = useCallback(
    ({ item, index }: { item: ArchivedHabit; index: number }) => (
      <AnimatedHabitCard
        habit={item}
        hasReachedLimit={state.hasReachedHabitLimit}
        index={index}
        isSelected={state.selectedIds.has(item._id)}
        reducedMotion={state.reducedMotion}
        selectionMode={state.selectionMode}
        onDelete={state.handlePermanentDelete}
        onRestore={state.handleRestore}
        onToggleSelect={state.toggleSelection}
        onUpgradePress={handleUpgradePress}
      />
    ),
    [state, handleUpgradePress]
  );

  const keyExtractor = useCallback((item: ArchivedHabit) => item._id, []);
  const extraData = useMemo(
    () => [state.selectionMode, state.selectedIds.size],
    [state.selectionMode, state.selectedIds.size]
  );

  const ListFooter = state.selectionMode
    ? null
    : () => (
        <DangerZoneFooter
          habitCount={state.archivedHabits.length}
          onDeleteAll={state.handleDeleteAll}
        />
      );

  return (
    <View className='flex-1'>
      <ModalHeader
        habitCount={state.isLoading ? 0 : state.archivedHabits.length}
        insets={insets}
        selectionMode={state.selectionMode}
        onBack={onBack}
        onSelectPress={handleSelectPress}
      />
      {state.isLoading ? (
        <LoadingState />
      ) : state.archivedHabits.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          className='flex-1'
          contentContainerStyle={{
            paddingHorizontal: airy.screenPadH,
            paddingBottom: insets.bottom + 16 + (state.selectionMode ? 80 : 0),
          }}
          data={state.archivedHabits}
          extraData={extraData}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          keyExtractor={keyExtractor}
          ListFooterComponent={ListFooter}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
      {state.selectionMode ? (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <ArchiveSelectionBar
            selectedCount={state.selectedCount}
            onCancel={state.exitSelectionMode}
            onDelete={state.handleBatchDeletePress}
            onRestore={state.handleBatchRestorePress}
          />
        </View>
      ) : null}
    </View>
  );
}
