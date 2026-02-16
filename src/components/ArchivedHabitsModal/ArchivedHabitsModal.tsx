import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import {
  AnimatedHabitCard,
  EmptyState,
  ModalHeader,
  StatsSummaryBar,
} from './components';
import { LoadingState } from './components/LoadingState';
import type { ArchivedHabitsModalProps } from './types';

/**
 * ArchivedHabitsModal Component
 * 
 * Full-screen view displaying all archived habits with restore/delete actions.
 * 
 * **Trigger:** "Archived Habits" button in SettingsModal
 * 
 * **Display:**
 * - List of archived habits (virtualized FlatList)
 * - Summary bar with total count and "Delete All" option
 * - Each habit card shows: name, emoji, archive date
 * - Empty state when no archived habits
 * 
 * **Actions:**
 * - Restore individual habit (returns to active habits)
 * - Permanently delete individual habit
 * - Delete all archived habits (bulk action)
 * - Back to settings
 * - Close modal entirely
 * 
 * **Modal Type:** Rendered inside SettingsModal's RN Modal
 * (Not a separate modal - view state change within SettingsModal)
 * 
 * **Lifecycle:**
 * - Opens: When SettingsModal view state changes to 'archived'
 * - Closes: onBack returns to settings view, onClose exits SettingsModal entirely
 * 
 * **Pattern:** Standalone component rendered conditionally, not using shared Modal
 * Uses FlatList with virtualization for performance with many archived habits
 */
export default function ArchivedHabitsModal({
  onClose,
  onBack,
}: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();
  const {
    archivedHabits,
    handleRestore,
    handlePermanentDelete,
    handleDeleteAll,
    isLoading,
  } = useArchivedHabitsModalLogic();

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof archivedHabits)[0]; index: number }) => (
      <AnimatedHabitCard
        habit={item}
        index={index}
        reducedMotion={reducedMotion}
        onDelete={handlePermanentDelete}
        onRestore={handleRestore}
      />
    ),
    [reducedMotion, handlePermanentDelete, handleRestore]
  );

  const keyExtractor = useCallback(
    (item: (typeof archivedHabits)[0]) => item._id,
    []
  );

  return (
    <>
      <ModalHeader insets={insets} onBack={onBack} onClose={onClose} />

      <StatsSummaryBar
        habitCount={isLoading ? 0 : archivedHabits.length}
        onDeleteAll={handleDeleteAll}
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          className='flex-1'
          contentContainerStyle={{ gap: 12, paddingBottom: insets.bottom + 16 }}
          data={archivedHabits}
          initialNumToRender={10}
          keyExtractor={keyExtractor}
          ListEmptyComponent={EmptyState}
          maxToRenderPerBatch={10}
          removeClippedSubviews
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          windowSize={5}
        />
      )}
    </>
  );
}
