import { useCallback } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import { ScreenHeader } from '../ScreenHeader';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { EmptyState } from './components';
import { CompactHabitRow } from './components/CompactHabitRow';
import { LoadingState } from './components/LoadingState';
import type { ArchivedHabitsModalProps, ArchivedHabit } from './types';

function getSubtitle(isLoading: boolean, count: number) {
  if (isLoading) return undefined;
  if (count === 0) return 'No archived habits';
  return count === 1 ? '1 habit waiting to come back' : `${count} habits waiting to come back`;
}

export default function ArchivedHabitsModal({ onClose, onBack }: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
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
  const subtitle = getSubtitle(logic.isLoading, logic.archivedHabits.length);

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <ScreenHeader
        leftAction='back'
        rightAction={<ModalCloseButton label='Close archived habits' onClose={onClose} />}
        subtitle={subtitle}
        title='Archived Habits'
        onBack={onBack}
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
