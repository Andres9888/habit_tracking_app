import { Alert } from 'react-native';
import { QuickActionsSheet } from '../../../../components/QuickActionsSheet';
import { getTodayString } from '../../../../utils/getLocalDateString';
import type { QuickActionsSectionProps } from './HabitsModals.types';

function buildHabitData(
  quickActionsHabit: NonNullable<QuickActionsSectionProps['quickActionsHabit']>,
  tracking: QuickActionsSectionProps['tracking'],
  today: string
) {
  return {
    _id: quickActionsHabit._id,
    completed: tracking.some(
      (t) =>
        t.habitId === quickActionsHabit._id && t.date === today && t.completed
    ),
    icon: quickActionsHabit.icon,
    name: quickActionsHabit.name,
  };
}

/** Quick actions section - bottom sheet with habit quick actions */
export function QuickActionsSection({
  closeQuickActions,
  onDeleteHabit,
  openEditHabit,
  openHabitCalendar,
  openHabitDetail,
  openPauseModal,
  openVisualizationExercise,
  quickActionsHabit,
  showQuickActions,
  toggleHabit,
  tracking,
}: QuickActionsSectionProps) {
  const today = getTodayString();
  const habit = quickActionsHabit
    ? buildHabitData(quickActionsHabit, tracking, today)
    : null;

  const handleDelete = () => {
    if (!quickActionsHabit) return;
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${quickActionsHabit.name}"? This cannot be undone.`,
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            void onDeleteHabit(quickActionsHabit._id);
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  };

  const createHandler =
    (action: (habit: NonNullable<typeof quickActionsHabit>) => void) => () => {
      if (quickActionsHabit) action(quickActionsHabit);
    };

  return (
    <QuickActionsSheet
      habit={habit}
      visible={showQuickActions}
      onClose={closeQuickActions}
      onComplete={() => {
        if (quickActionsHabit)
          void toggleHabit({ date: today, habitId: quickActionsHabit._id });
      }}
      onDelete={handleDelete}
      onEdit={createHandler(openEditHabit)}
      onMentalBoost={createHandler(openVisualizationExercise)}
      onPause={createHandler((h) => openPauseModal(h._id))}
      onViewCalendar={createHandler(openHabitCalendar)}
      onViewDetails={createHandler(openHabitDetail)}
    />
  );
}
