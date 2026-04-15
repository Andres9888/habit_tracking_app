import { useCallback, useMemo } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { EmptyState, ModalHeader } from './components';
import { ArchiveSelectionBar } from './components/ArchiveSelectionBar';
import { CompactHabitRow } from './components/CompactHabitRow';
import { DangerZoneFooter } from './components/DangerZoneFooter';
import { LoadingState } from './components/LoadingState';
import { StatsSummaryBar } from './components/StatsSummaryBar';
import type { ArchivedHabitsModalProps, ArchivedHabit } from './types';
import { useArchiveSelection } from './useArchiveSelection';
import { useArchiveSelectionActions } from './useArchiveSelectionActions';

export default function ArchivedHabitsModal({
  onClose,
  onBack,
}: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const logic = useArchivedHabitsModalLogic();
  const selection = useArchiveSelection();

  const handleUpgradePress = useCallback(() => {
    Alert.alert(
      'Upgrade to Premium',
      "You've reached the free limit of 3 active habits. Upgrade to premium for unlimited habits, or delete an active habit to make room.",
      [{ text: 'OK', style: 'default' }]
    );
  }, []);
  const archivedHabitIds = useMemo(
    () => logic.archivedHabits.map((habit) => habit._id),
    [logic.archivedHabits]
  );
  const { handleBatchDeletePress, handleBatchRestorePress, handleSelectAll } =
    useArchiveSelectionActions({
      archivedHabitIds,
      exitSelectionMode: selection.exitSelectionMode,
      handleBatchDelete: logic.handleBatchDelete,
      handleBatchRestore: logic.handleBatchRestore,
      selectAll: selection.selectAll,
      selectedIds: selection.selectedIds,
    });
  const allSelected =
    logic.archivedHabits.length > 0 &&
    selection.selectedCount === logic.archivedHabits.length;
  const handleSelectionRestore = useCallback(() => {
    if (logic.hasReachedHabitLimit) {
      handleUpgradePress();
      return;
    }

    void handleBatchRestorePress();
  }, [logic.hasReachedHabitLimit, handleBatchRestorePress, handleUpgradePress]);

  const renderItem = useCallback(
    ({ item, index }: { item: ArchivedHabit; index: number }) => (
      <CompactHabitRow
        habit={item}
        hasReachedLimit={logic.hasReachedHabitLimit}
        index={index}
        isSelected={selection.selectedIds.has(item._id)}
        isLast={index === logic.archivedHabits.length - 1}
        onDelete={logic.handlePermanentDelete}
        onRestore={logic.handleRestore}
        onToggleSelect={selection.toggleSelection}
        onUpgradePress={handleUpgradePress}
        selectionMode={selection.selectionMode}
      />
    ),
    [
      logic,
      handleUpgradePress,
      selection.selectedIds,
      selection.selectionMode,
      selection.toggleSelection,
    ]
  );

  const keyExtractor = useCallback((item: ArchivedHabit) => item._id, []);

  return (
    <View className='flex-1'>
      <ModalHeader
        habitCount={logic.isLoading ? 0 : logic.archivedHabits.length}
        insets={insets}
        onBack={onBack}
        onClose={onClose}
      />
      {logic.isLoading ? (
        <LoadingState />
      ) : logic.archivedHabits.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <FlatList
            className='flex-1'
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom:
                insets.bottom + (selection.selectionMode ? 112 : 16),
            }}
            data={logic.archivedHabits}
            keyExtractor={keyExtractor}
            ListFooterComponent={
              selection.selectionMode ? null : (
                <DangerZoneFooter
                  habitCount={logic.archivedHabits.length}
                  onDeleteAll={logic.handleDeleteAll}
                />
              )
            }
            ListHeaderComponent={
              <View style={{ paddingTop: 4 }}>
                <StatsSummaryBar
                  allSelected={allSelected}
                  habitCount={logic.archivedHabits.length}
                  onSelectAll={handleSelectAll}
                  onToggleSelectionMode={selection.enterSelectionMode}
                  selectionMode={selection.selectionMode}
                />
              </View>
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
          {selection.selectionMode ? (
            <View
              pointerEvents='box-none'
              style={{ bottom: 0, left: 0, position: 'absolute', right: 0 }}
            >
              <ArchiveSelectionBar
                selectedCount={selection.selectedCount}
                onCancel={selection.exitSelectionMode}
                onDelete={handleBatchDeletePress}
                onRestore={handleSelectionRestore}
              />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}
