import { ActivationModal } from '../../../../components/MotivationSystem/Activation/ActivationModal';
import { getTodayString } from '../../../../utils/getLocalDateString';
import type { ActivationModalSectionProps } from './HabitsModals.types';

/** Build the activation habit data structure from the habit object */
function buildActivationHabitData(
  habit: NonNullable<ActivationModalSectionProps['activationModalHabit']>
) {
  return {
    cueAfterBehavior: habit.cueAfterBehavior,
    cueLocation: habit.cueLocation,
    cueTime: habit.cueTime,
    currentStreak: habit.currentStreak ?? 0,
    icon: habit.icon,
    id: habit._id,
    name: habit.name,
    totalCompletions: habit.totalCompletions ?? 0,
    vizFailureBody: habit.vizFailureBody,
    vizFailureEmotion: habit.vizFailureEmotion,
    vizFailureMind: habit.vizFailureMind,
    vizSuccessBody: habit.vizSuccessBody,
    vizSuccessEmotion: habit.vizSuccessEmotion,
    vizSuccessMind: habit.vizSuccessMind,
    why: habit.why,
    woopObstacle: habit.woopObstacle,
    woopPlan: habit.woopPlan,
  };
}

// Snooze for 10 minutes (future enhancement: schedule delayed notification)
function handleSnooze() {
  /* noop - placeholder for future implementation */
}

// Start "Just 2 Min" mode - closes modal and user commits to 2 min
function handleJustTwoMin() {
  /* noop - placeholder for future implementation */
}

/** Activation modal section - triggered from notification tap (T7.8) */
export function ActivationModalSection({
  activationModalHabit,
  closeActivationModal,
  reduceMotionPreference,
  showActivationModal,
  toggleHabit,
}: ActivationModalSectionProps) {
  const today = getTodayString();

  const handleStartNow = () => {
    if (activationModalHabit) {
      void toggleHabit({ date: today, habitId: activationModalHabit._id });
    }
  };

  return (
    <ActivationModal
      habit={
        activationModalHabit
          ? buildActivationHabitData(activationModalHabit)
          : null
      }
      reduceMotion={reduceMotionPreference}
      visible={showActivationModal}
      onClose={closeActivationModal}
      onJustTwoMin={handleJustTwoMin}
      onSnooze={handleSnooze}
      onStartNow={handleStartNow}
    />
  );
}
