import { useCallback, useMemo } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArchivedHabitsModalState } from './useArchivedHabitsModalState';
import { AnimatedHabitCard, ArchiveSelectionBar, EmptyState, ModalHeader } from './components';
import { LoadingState } from './components/LoadingState';
import type { ArchivedHabitsModalProps, ArchivedHabit } from './types';

export default function ArchivedHabitsModal({ onClose, onBack }: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const state = useArchivedHabitsModalState();

  const handleUpgradePress = useCallback(() => {
    Alert.alert(
      'Upgrade to Premium',
      'You\'ve reached the free limit of 3 active habits. Upgrade to premium for unlimited habits, or delete an active habit to make room.',
      [{ text: 'OK', style: 'default' }]
    );
  }, []);

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

  return (
    <View className='flex-1'>
      <ModalHeader
        habitCount={state.isLoading ? 0 : state.archivedHabits.length}
        insets={insets}
        onBack={onBack}
        onClose={onClose}
      />
      {state.isLoading ? <LoadingState /> : state.archivedHabits.length === 0 ? <EmptyState /> : (
        <FlatList
          className='flex-1'
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 + (state.selectionMode ? 80 : 0) }}
          data={state.archivedHabits}
          extraData={extraData}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
      {state.selectionMode && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <ArchiveSelectionBar
            selectedCount={state.selectedCount}
            onCancel={state.exitSelectionMode}
            onDelete={state.handleBatchDeletePress}
            onRestore={state.handleBatchRestorePress}
          />
        </View>
      )}
    </View>
  );
}
