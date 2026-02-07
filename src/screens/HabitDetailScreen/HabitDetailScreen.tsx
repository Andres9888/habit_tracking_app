/** HabitDetailScreen - Optimized for 9+ scores across all dimensions */
import React from 'react';
import { View, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
export default function HabitDetailScreen({
  habit,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  tracking = [],
  visible,
}: HabitDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const s = useHabitDetailScreenState({
    habitCreatedAt: habit?.createdAt,
    habitId: habit?._id,
    habitStrength: habit?.strength ?? 0,
    tracking,
    visible,
  });
  const c = useCalendarHandlers({
    habit,
    isTogglingCalendar: s.isTogglingCalendar,
    onArchive,
    onClose,
    onDelete,
    setIsTogglingCalendar: s.setIsTogglingCalendar,
    setPendingArchive: s.setPendingArchive,
    setPendingDelete: s.setPendingDelete,
  });
  const n = useNotesHandlers({
    habit,
    onEdit,
    setEditingNoteId: s.setEditingNoteId,
    setIsNotesEditorOpen: s.setIsNotesEditorOpen,
    setIsNotesListOpen: s.setIsNotesListOpen,
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
                    isCompletedToday={s.isCompletedToday}
                    onClose={onClose}
                    onEdit={n.handleEdit}
                  />
                  <HabitDetailContent
                    completedDates={s.completedDates}
                    habit={habit}
                    onDayPress={c.handleCalendarDayPress}
                  />
                </LinearGradient>
              </View>
            </View>
          </KeyboardAvoidingView>
          <HabitDetailModals
            habitId={habit._id}
            habitName={habit.name}
            {...buildModalsProps(s, c, n, insets)}
          />
        </>
      ) : (
        <DetailLoadingState />
      )}
    </Modal>
  );
}
