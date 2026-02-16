/* eslint-disable max-lines */
/**
 * @fileoverview HabitDetailScreen - Full-screen habit detail modal
 * 
 * **What it shows:**
 * - Detail header (habit name, emoji, edit button, close button)
 * - Hero section with completion toggle and current streak
 * - Calendar view (monthly, shows completed dates with visual markers)
 * - Quick stats strip (streak, strength, completion rate)
 * - Notes by date (if any notes exist for selected dates)
 * - Action buttons (Archive, Delete)
 * 
 * **How users get here:**
 * - Tap habit card in main habits list
 * - From analytics screen habit links
 * - Deep link to specific habit
 * 
 * **Key interactions:**
 * - Calendar day tap → Toggle completion for that date
 * - Edit button → Opens HabitEditScreen modal
 * - Close button → Closes modal (calls onClose)
 * - Archive → Confirms, then archives habit (calls onArchive)
 * - Delete → Confirms, then deletes habit (calls onDelete)
 * - Add note → Opens notes editor modal
 * - View notes → Opens notes list modal
 * - Undo toast (after toggle) → Reverts recent completion change
 * 
 * **Modals within modals:**
 * - Notes editor modal
 * - Notes list modal
 * - Confirmation modals (archive, delete)
 * 
 * **Technical notes:**
 * - 123 lines (main orchestration component)
 * - Three custom hooks:
 *   - useHabitDetailScreenState (UI state, completion data)
 *   - useCalendarHandlers (day press, archive, delete logic)
 *   - useNotesHandlers (notes CRUD operations)
 * - Linear gradient background (light/dark theme variants)
 * - Keyboard-avoiding layout for notes input
 * - Safe area insets handling
 * - Loading state with skeleton
 * - Modal animation: slide up from bottom
 */
import React from 'react';
import { View, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import {
  DetailHeader,
  DetailLoadingState,
  HabitDetailContent,
  HabitDetailModals,
} from './components';
import {
  DETAIL_BG_GRADIENT_LIGHT,
  DETAIL_BG_GRADIENT_DARK,
  buildModalsProps,
} from './HabitDetailScreen.constants';
import { useThemeColors } from '../../theme';
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
  const { isDark } = useThemeColors();
  const bgGradient = isDark ? DETAIL_BG_GRADIENT_DARK : DETAIL_BG_GRADIENT_LIGHT;
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
                  colors={bgGradient as unknown as string[]}
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
                    notesByDate={screenState.notesByDate}
                    onDayPress={calendarHandlers.handleCalendarDayPress}
                  />
                </LinearGradient>
              </View>
            </View>
          </KeyboardAvoidingView>
          <HabitDetailModals
            habitId={habit._id}
            habitName={habit.name}
            {...buildModalsProps(
              screenState,
              calendarHandlers,
              notesHandlers,
              insets
            )}
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
    <ScreenErrorBoundary screenName="Habit Details" onGoBack={props.onClose}>
      <HabitDetailScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
