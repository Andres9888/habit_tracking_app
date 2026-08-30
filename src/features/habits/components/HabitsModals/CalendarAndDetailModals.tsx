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
  const handleToggleHabit = (args: Parameters<typeof toggleHabit>[0]) => {
    void toggleHabit(args);
  };
  const handleArchivePress = (habitId: Parameters<typeof handleArchive>[0]) => {
    void handleArchive(habitId);
  };
  const handleDeleteHabit = (habitId: Parameters<typeof onDeleteHabit>[0]) => {
    void onDeleteHabit(habitId);
  };

  // One instance, two mount points. Habit Detail is a React Native <Modal>,
  // which renders nothing while closed, so an edit screen living only in its
  // `editOverlay` slot is dead for every Edit entry point that does not open
  // Habit Detail first (quick actions). Mount it as a sibling in that case.
  const editScreen = (
    <HabitEditScreen
      habitId={habitToEdit?._id ?? null}
      initialHabit={habitToEdit}
      visible={showEditScreen}
      onClose={closeEditScreen}
      onHabitRemoved={() => {
        closeEditScreen();
        closeHabitDetail();
      }}
      onOpenCueEditor={openMotivationFromEdit}
      onOpenVisionBoard={openMotivationFromEdit}
    />
  );

  return (
    <>
      <ErrorBoundary>
        <HabitCalendarModal
          habit={selectedHabit}
          streak={selectedHabit ? getStreak(selectedHabit._id) : 0}
          toggleHabit={handleToggleHabit}
          tracking={tracking}
          visible={showHabitCalendar}
          onClose={closeHabitCalendar}
          onOpenMotivationTab={openMotivationTab}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <HabitDetailScreen
          editOverlay={showHabitDetail ? editScreen : null}
          habit={selectedHabit}
          tracking={tracking}
          visible={showHabitDetail}
          onArchive={handleArchivePress}
          onClose={closeHabitDetail}
          onDelete={handleDeleteHabit}
          onEdit={(habit) => {
            openEditHabit(habit);
          }}
          onOpenCalendar={openHabitCalendar}
        />
      </ErrorBoundary>
      {showHabitDetail ? null : <ErrorBoundary>{editScreen}</ErrorBoundary>}
    </>
  );
}
