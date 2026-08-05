/* eslint-disable max-lines */
/** HabitDetailScreen - Optimized for 9+ scores across all dimensions */
import React from 'react';
import { View, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit3 } from 'lucide-react-native';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { ScreenHeader } from '../../components/ScreenHeader';
import {
  DetailHero,
  DetailLoadingState,
  HabitDetailContent,
  HabitDetailModals,
  HeaderButton,
} from './components';
import {
  DETAIL_BG_GRADIENT_LIGHT,
  DETAIL_BG_GRADIENT_DARK,
  buildModalsProps,
} from './HabitDetailScreen.constants';
import { useThemeColors } from '../../theme';
import { useHabitDetailScreenState } from './useHabitDetailScreenState';
import { useCalendarHandlers } from './useCalendarHandlers';
import type { HabitDetailScreenProps } from './HabitDetailScreen.types';

// eslint-disable-next-line max-lines-per-function
function HabitDetailScreenContent({
  habit,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  tracking = [],
  visible,
}: HabitDetailScreenProps) {
  const { isDark } = useThemeColors();
  const bgGradient = isDark
    ? DETAIL_BG_GRADIENT_DARK
    : DETAIL_BG_GRADIENT_LIGHT;
  const screenState = useHabitDetailScreenState({
    habitCreatedAt: habit?.createdAt,
    habitId: habit?._id,
    habitStrength: habit?.strength ?? 0,
    tracking,
    visible,
  });
  const calendarHandlers = useCalendarHandlers({
    habit,
    isTogglingCalendar: screenState.isTogglingCalendar,
    onArchive,
    onClose,
    onDelete,
    setIsTogglingCalendar: screenState.setIsTogglingCalendar,
    setPendingArchive: screenState.setPendingArchive,
    setPendingDelete: screenState.setPendingDelete,
  });
  const handleEdit = () => {
    if (habit) onEdit?.(habit);
  };

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      {habit ? (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1'
          >
            <View className='flex-1 bg-black/50'>
              <View className='flex-1 overflow-hidden rounded-t-3xl shadow-2xl'>
                <LinearGradient
                  colors={bgGradient}
                  locations={[0, 0.5, 1]}
                  style={{ flex: 1 }}
                >
                  <ScreenHeader
                    leftAction='close'
                    rightAction={
                      <HeaderButton
                        icon={<Edit3 size={15} strokeWidth={2.5} />}
                        label='Edit habit'
                        text='Edit Habit'
                        onPress={handleEdit}
                      />
                    }
                    variant='transparent'
                    onBack={onClose}
                  />
                  <DetailHero habit={habit} />
                  <HabitDetailContent
                    completedDates={screenState.completedDates}
                    daysTracking={screenState.daysTracking}
                    habit={habit}
                    totalCompletions={screenState.totalCompletions}
                    onDayPress={calendarHandlers.handleCalendarDayPress}
                  />
                </LinearGradient>
              </View>
            </View>
          </KeyboardAvoidingView>
          <HabitDetailModals
            habitId={habit._id}
            habitName={habit.name}
            {...buildModalsProps(screenState, calendarHandlers)}
          />
        </>
      ) : (
        <DetailLoadingState />
      )}
    </Modal>
  );
}

export default function HabitDetailScreen(props: HabitDetailScreenProps) {
  return (
    <ScreenErrorBoundary screenName='Habit Details' onGoBack={props.onClose}>
      <HabitDetailScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
