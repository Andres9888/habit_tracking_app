import { useCallback } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { EmptyState, ModalHeader } from './components';
import { CompactHabitRow } from './components/CompactHabitRow';
import { LoadingState } from './components/LoadingState';
import type { ArchivedHabitsModalProps, ArchivedHabit } from './types';

export default function ArchivedHabitsModal({ onClose, onBack }: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const logic = useArchivedHabitsModalLogic();

  const handleUpgradePress = useCallback(() => {
    Alert.alert(
      'Upgrade to Premium',
      'You\'ve reached the free limit of 3 active habits. Upgrade to premium for unlimited habits, or delete an active habit to make room.',
      [{ text: 'OK', style: 'default' }]
    );
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: ArchivedHabit; index: number }) => (
      <CompactHabitRow
        habit={item}
        hasReachedLimit={logic.hasReachedHabitLimit}
        isLast={index === logic.archivedHabits.length - 1}
        onDelete={logic.handlePermanentDelete}
        onRestore={logic.handleRestore}
        onUpgradePress={handleUpgradePress}
      />
    ),
    [logic, handleUpgradePress]
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
      {logic.isLoading ? <LoadingState /> : logic.archivedHabits.length === 0 ? <EmptyState /> : (
        <FlatList
          className='flex-1'
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}
          data={logic.archivedHabits}
          keyExtractor={keyExtractor}
          ListHeaderComponent={<View style={{ height: 4 }} />}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
