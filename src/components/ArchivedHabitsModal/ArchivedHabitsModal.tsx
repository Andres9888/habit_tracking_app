import { ScrollView, View } from 'react-native';
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

export default function ArchivedHabitsModal({
  onClose,
  onBack,
}: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();
  const { archivedHabits, handleRestore, handlePermanentDelete, handleDeleteAll, isLoading } =
    useArchivedHabitsModalLogic();

  return (
    <>
      <ModalHeader insets={insets} onBack={onBack} onClose={onClose} />

      <StatsSummaryBar
        habitCount={isLoading ? 0 : archivedHabits.length}
        onDeleteAll={handleDeleteAll}
      />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <LoadingState />
        ) : archivedHabits.length === 0 ? (
          <EmptyState />
        ) : (
          <View className='gap-3'>
            {archivedHabits.map((habit, index) => (
              <AnimatedHabitCard
                key={habit._id}
                habit={habit}
                index={index}
                reducedMotion={reducedMotion}
                onDelete={handlePermanentDelete}
                onRestore={handleRestore}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}
