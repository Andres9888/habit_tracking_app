
import { FlatList, View } from 'react-native';
import { useCallback } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ArchivedHabitsModalProps } from './types';
import {
  AnimatedHabitCard,
  EmptyState,
  ModalHeader,
  StatsSummaryBar,
} from './components';
import { LoadingState } from './components/LoadingState';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export default function ArchivedHabitsModal({
  onClose,
  onBack,
}: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();
  const { archivedHabits, handleRestore, handlePermanentDelete, handleDeleteAll, isLoading } =
    useArchivedHabitsModalLogic();

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
