import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import {
  AnimatedHabitCard,
  DangerZoneFooter,
  EmptyState,
  ModalHeader,
  StatsSummaryBar,
} from './components';
import { LoadingState } from './components/LoadingState';
import type { ArchivedHabitsModalProps } from './types';

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

      <StatsSummaryBar habitCount={isLoading ? 0 : archivedHabits.length} />

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
          ListFooterComponent={
            archivedHabits.length > 1 ? (
              <DangerZoneFooter
                habitCount={archivedHabits.length}
                onDeleteAll={handleDeleteAll}
              />
            ) : undefined
          }
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
