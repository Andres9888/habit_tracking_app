import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecentlyDeletedModalLogic } from './RecentlyDeletedModal.hooks';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import {
  DeletedHabitCard,
  EmptyState,
  LoadingState,
  ModalHeader,
  StatsSummaryBar,
} from './components';
import type { RecentlyDeletedModalProps } from './types';

export default function RecentlyDeletedModal({
  onClose,
  onBack,
}: RecentlyDeletedModalProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();
  const {
    deletedHabits,
    getDaysRemaining,
    handleRestore,
    handlePermanentDelete,
    isLoading,
  } = useRecentlyDeletedModalLogic();

  return (
    <>
      <ModalHeader insets={insets} onBack={onBack} onClose={onClose} />

      <StatsSummaryBar habitCount={isLoading ? 0 : deletedHabits.length} />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <LoadingState />
        ) : deletedHabits.length === 0 ? (
          <EmptyState />
        ) : (
          <View className='gap-3 px-4'>
            {deletedHabits.map((habit, index) => (
              <DeletedHabitCard
                key={habit._id}
                habit={habit}
                index={index}
                daysRemaining={getDaysRemaining(habit.deletedAt)}
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
