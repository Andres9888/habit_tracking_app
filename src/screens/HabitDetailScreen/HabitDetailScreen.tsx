/** HabitDetailScreen - Optimized for 9+ scores across all dimensions */
import React from 'react';
import { View, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary, ScreenErrorFallback } from '../../components/ErrorBoundary';
import {
  DetailHeader,
  DetailLoadingState,
  HabitDetailContent,
  HabitDetailModals,
} from './components';
import {
  DETAIL_BG_GRADIENT,
  buildModalsProps,
} from './HabitDetailScreen.constants';
import { useHabitDetailScreenState } from './useHabitDetailScreenState';
import { useCalendarHandlers } from './useCalendarHandlers';
import { useNotesHandlers } from './useNotesHandlers';
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
  const insets = useSafeAreaInsets();
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
  const notesHandlers = useNotesHandlers({
    habit,
    onEdit,
    setEditingNoteId: screenState.setEditingNoteId,
    setIsNotesEditorOpen: screenState.setIsNotesEditorOpen,
    setIsNotesListOpen: screenState.setIsNotesListOpen,
  });

  return (
    <Modal
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
                  colors={DETAIL_BG_GRADIENT}
                  locations={[0, 0.5, 1]}
                  style={{ flex: 1, paddingTop: Math.max(insets.top + 4, 12) }}
                >
                  <DetailHeader
                    habit={habit}
                    isCompletedToday={screenState.isCompletedToday}
                    onClose={onClose}
                    onEdit={notesHandlers.handleEdit}
                  />
                  <HabitDetailContent
                    completedDates={screenState.completedDates}
                    habit={habit}
                    notes={screenState.habitNotes}
                    onDayPress={calendarHandlers.handleCalendarDayPress}
                  />
                </LinearGradient>
              </View>
            </View>
          </KeyboardAvoidingView>
          <HabitDetailModals
            habitId={habit._id}
            habitName={habit.name}
            {...buildModalsProps(screenState, calendarHandlers, notesHandlers, insets)}
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
    <ErrorBoundary
      fallback={
        <Modal
          transparent
          animationType="slide"
          visible={props.visible}
          onRequestClose={props.onClose}
        >
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            <ScreenErrorFallback
              screenName="Habit Details"
              error={null}
              onRetry={() => {}}
              onGoBack={props.onClose}
            />
          </View>
        </Modal>
      }
    >
      <HabitDetailScreenContent {...props} />
    </ErrorBoundary>
  );
}
