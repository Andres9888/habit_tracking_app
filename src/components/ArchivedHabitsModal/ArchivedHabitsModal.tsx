import { useCallback } from 'react';
import { FlatList, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { AnimatedHabitCard, EmptyState, ModalHeader } from './components';
import { LoadingState } from './components/LoadingState';
import { useThemeColors } from '../../theme/ThemeContext';
import type { ArchivedHabitsModalProps } from './types';

export default function ArchivedHabitsModal({
  onClose,
  onBack,
}: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();
  const { isDark } = useThemeColors();
  const {
    archivedHabits,
    handleRestore,
    handlePermanentDelete,
    isLoading,
  } = useArchivedHabitsModalLogic();

  const habitCount = isLoading ? 0 : archivedHabits.length;

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

  const swipeHint = habitCount > 0 ? (
    <Text
      className="text-center"
      style={{
        color: isDark ? '#4b5563' : '#cbd5e1',
        fontSize: 12,
        paddingTop: 24,
        paddingBottom: 16,
      }}
    >
      ← Swipe left to delete
    </Text>
  ) : undefined;

  return (
    <>
      <ModalHeader
        habitCount={habitCount}
        insets={insets}
        onBack={onBack}
        onClose={onClose}
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          className='flex-1'
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          data={archivedHabits}
          initialNumToRender={10}
          keyExtractor={keyExtractor}
          ListEmptyComponent={EmptyState}
          ListFooterComponent={swipeHint}
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
