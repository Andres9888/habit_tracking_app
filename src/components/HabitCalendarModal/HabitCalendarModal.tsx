/**
 * HabitCalendarModal Component
 * 
 * Full-screen modal displaying detailed habit statistics and calendar view.
 * 
 * **Trigger:** Tap habit card in main list
 * 
 * **Display:**
 * - Header with habit name, edit button, close button
 * - Status ribbon: Emoji, name, current streak, schedule, quick log button
 * - Stats card: Current/best streak, completion percentage, recent miss badge
 * - Calendar tabs: Month view (interactive calendar) or Heatmap (6-month history)
 * - Activity log: Chronological list of completions and notes
 * - Can open HabitEditScreen (nested modal)
 * 
 * **Actions:**
 * - View habit completion history in calendar
 * - Quick mark today as complete/incomplete
 * - Switch between month and heatmap views
 * - Edit habit (opens HabitEditScreen)
 * - Navigate to motivation features (affirmations, vision board, cues)
 * - Close modal
 * 
 * **Modal Type:** React Native Modal (slide animation) with SafeAreaView
 * 
 * **Lifecycle:**
 * - Opens: visible=true via habit card tap
 * - Closes: onClose via close button or back gesture
 * - Can open nested HabitEditScreen modal
 * 
 * **Pattern:** Uses RN Modal directly with scrollable content
 * Manages nested modal state for edit screen
 * Full-height scrollable view with multiple sections
 */
import { Modal, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import { StatsCard } from './StatsCard';
import { ActivityLog } from './ActivityLog';
import { CalendarTabs } from './CalendarTabs';
import { ModalHeader } from './ModalHeader';
import { StatusRibbon } from './StatusRibbon';
import HeatmapCalendar from './HeatmapCalendar';
import HabitCalendarView from '../HabitCalendarView';
import HabitEditScreen from '../../screens/HabitEditScreen';
import { useHabitCalendarModal } from './useHabitCalendarModal';
import type { HabitCalendarModalProps } from './types';

export default function HabitCalendarModal({
  visible,
  onClose,
  habit,
  streak,
  tracking,
  toggleHabit,
  onOpenMotivationTab,
}: HabitCalendarModalProps) {
  const { colors } = useThemeColors();
  const state = useHabitCalendarModal({
    habit,
    onClose,
    onOpenMotivationTab,
    toggleHabit,
    tracking,
  });

  if (!state.isValid || !habit) return null;

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
      <SafeAreaView className='flex-1' style={{ backgroundColor: colors.background }}>
        <ModalHeader name={state.name} onClose={onClose} onEdit={state.handleEditPress} />

        <ScrollView className='px-4' showsVerticalScrollIndicator={false}>
          <StatusRibbon
            bestStreak={state.bestStreak}
            emoji={state.emoji}
            isTodayCompleted={state.isTodayCompleted}
            name={state.name}
            notes={habit.notes}
            recentMissBadge={state.recentMissBadge}
            scheduleLabel={state.scheduleLabel}
            streak={streak}
            onEdit={state.handleEditPress}
            onMarkToday={state.handleQuickLogPress}
          />

          <View className='mt-5'>
            <StatsCard
              bestStreak={state.bestStreak}
              completionPercentage={state.completionPercentage}
              currentStreak={streak}
              emoji={state.emoji}
              habitName={habit.name}
              habitNotes={habit.notes}
              showHeader={false}
            />
          </View>

          <View className='mt-8'>
            <CalendarTabs activeView={state.calendarView} onViewChange={state.setCalendarView} />
            {state.calendarView === 'month' ? (
              <HabitCalendarView habitId={habit._id} toggleHabit={toggleHabit} tracking={tracking} />
            ) : (
              <HeatmapCalendar habitId={habit._id} monthsToShow={6} tracking={tracking} />
            )}
          </View>

          <View className='mt-8 pb-6'>
            <ActivityLog tracking={state.habitTrackingEntries} />
          </View>
        </ScrollView>
      </SafeAreaView>

      <HabitEditScreen
        habitId={habit._id}
        visible={state.showEditScreen}
        onClose={state.handleCloseEdit}
        onOpenAffirmationsEditor={onOpenMotivationTab ? state.handleOpenAdvancedFeatures : undefined}
        onOpenCueEditor={onOpenMotivationTab ? state.handleOpenAdvancedFeatures : undefined}
        onOpenVisionBoard={onOpenMotivationTab ? state.handleOpenAdvancedFeatures : undefined}
      />
    </Modal>
  );
}
