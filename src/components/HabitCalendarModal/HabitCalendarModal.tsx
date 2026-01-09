import { Modal, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const state = useHabitCalendarModal({
    habit,
    tracking,
    toggleHabit,
    onClose,
    onOpenMotivationTab,
  });

  if (!state.isValid || !habit) return null;

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
      <SafeAreaView className='flex-1 bg-[#F8F5F1]'>
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
        onOpenCueEditor={onOpenMotivationTab ? state.handleOpenAdvancedFeatures : undefined}
        onOpenAffirmationsEditor={onOpenMotivationTab ? state.handleOpenAdvancedFeatures : undefined}
        onOpenVisionBoard={onOpenMotivationTab ? state.handleOpenAdvancedFeatures : undefined}
      />
    </Modal>
  );
}
