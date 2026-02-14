import ErrorBoundary from '../../../../components/ErrorBoundary';
import HabitCalendarModal from '../../../../components/HabitCalendarModal';
import HabitDetailScreen from '../../../../screens/HabitDetailScreen';
import HabitEditScreen from '../../../../screens/HabitEditScreen';
import type { CalendarAndDetailModalsProps } from './HabitsModals.types';

/** Calendar and detail modals section - handles habit calendar, detail, and edit screens */
export function CalendarAndDetailModals(props: CalendarAndDetailModalsProps) {
  const {
    closeEditScreen,
    closeHabitCalendar,
    closeHabitDetail,
    getStreak,
    habitToEdit,
    handleArchive,
    onDeleteHabit,
    openEditHabit,
    openHabitCalendar,
    openHabitDetail,
    openPauseModal,
    selectedHabit,
    showEditScreen,
    showHabitCalendar,
    showHabitDetail,
    toggleHabit,
    tracking,
  } = props;

  const openMotivationTab = () => {
    if (selectedHabit) {
      closeHabitCalendar();
      openHabitDetail(selectedHabit, 'motivation');
    }
  };

  const openMotivationFromEdit = () => {
    closeEditScreen();
    if (habitToEdit) openHabitDetail(habitToEdit, 'motivation');
  };

  const handleEditFromCalendar = () => {
    if (selectedHabit) openEditHabit(selectedHabit);
  };

  return (
    <>
      <ErrorBoundary>
        <HabitCalendarModal
          habit={selectedHabit}
          streak={selectedHabit ? getStreak(selectedHabit._id) : 0}
          toggleHabit={toggleHabit}
          tracking={tracking}
          visible={showHabitCalendar}
          onClose={closeHabitCalendar}
          onEdit={handleEditFromCalendar}
          onOpenMotivationTab={openMotivationTab}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <HabitDetailScreen
          habit={selectedHabit}
          tracking={tracking}
          visible={showHabitDetail}
          onArchive={handleArchive}
          onClose={closeHabitDetail}
          onDelete={onDeleteHabit}
          onEdit={(habit) => {
            closeHabitDetail();
            openEditHabit(habit);
          }}
          onOpenCalendar={openHabitCalendar}
          onPause={openPauseModal}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <HabitEditScreen
          habitId={habitToEdit?._id ?? null}
          visible={showEditScreen}
          onClose={closeEditScreen}
          onOpenAffirmationsEditor={openMotivationFromEdit}
          onOpenCueEditor={openMotivationFromEdit}
          onOpenVisionBoard={openMotivationFromEdit}
        />
      </ErrorBoundary>
    </>
  );
}
