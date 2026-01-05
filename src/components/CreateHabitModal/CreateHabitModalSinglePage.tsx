import { useCallback, useState } from 'react';
import { Modal, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ColorPickerSheet } from './ColorPickerSheet';
import TemplateScienceModal from '../TemplateScienceModal';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { ModalHeader } from './components/ModalHeader';
import { CreateHabitFormSingle } from './components/CreateHabitFormSingle';
import type { TimeOfDay } from './components/TimeOfDaySelector';

/**
 * Single-page habit creation modal (no wizard)
 *
 * UX Benefits:
 * - Fewer taps: 1-2 taps vs wizard's 3-4 taps
 * - Faster completion: ~30 seconds vs ~60 seconds
 * - All fields visible: No "what's next?" confusion
 * - Keyboard friendly: Tab navigation works
 * - Power user optimized: Minimal friction
 *
 * Trade-offs:
 * - Less guided for first-time users
 * - More fields visible at once (could feel overwhelming)
 * - No progress indicator (less gamification)
 *
 * Best for: Users who know what habit they want to create
 */

// Swipe dismissal constants
const SWIPE_DISMISS_THRESHOLD = 100; // pixels
const SWIPE_VELOCITY_THRESHOLD = 500; // pixels per second

export default function CreateHabitModalSinglePage(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, template, science, handleCreate } =
    useCreateHabitModal(props);

  // Form state
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');

  // Swipe dismissal gesture state
  const translateY = useSharedValue(0);
  const context = useSharedValue({ startY: 0 });

  // Pan gesture for swipe-to-dismiss
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { startY: translateY.value };
    })
    .onUpdate((event) => {
      // Only allow downward swipes
      const newTranslateY = context.value.startY + event.translationY;
      if (newTranslateY >= 0) {
        translateY.value = newTranslateY;
      }
    })
    .onEnd((event) => {
      const shouldDismiss =
        translateY.value > SWIPE_DISMISS_THRESHOLD ||
        event.velocityY > SWIPE_VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        runOnJS(onClose)();
        translateY.value = 0;
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleNameChange = useCallback(
    (value: string) => {
      form.setHabitName(value);
    },
    [form]
  );

  const handleTimeOfDayChange = useCallback(
    (value: TimeOfDay) => {
      setTimeOfDay(value);

      // Map TimeOfDay to preferredTime (Huberman phases)
      form.setDayPhase(
        value === 'morning'
          ? 'phase1_push'
          : value === 'afternoon'
            ? 'phase2_pivot'
            : 'phase3_pull'
      );

      // Auto-enable reminders when time is selected
      form.setRemindersEnabled(true);

      // Set default reminder time based on selection
      const defaultTimes = {
        morning: '7:00 AM',
        afternoon: '12:00 PM',
        evening: '8:00 PM',
      };

      const [time, period] = defaultTimes[value].split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      let hour = hours;
      if (period === 'PM' && hours !== 12) hour += 12;
      if (period === 'AM' && hours === 12) hour = 0;
      date.setHours(hour, minutes, 0, 0);
      form.setReminderTime(date);
    },
    [form]
  );

  const handleFormSubmit = useCallback(() => {
    // Form completed - create the habit
    handleCreate();
  }, [handleCreate]);

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={animatedStyle}
            className="flex-1 overflow-hidden rounded-t-3xl bg-[#faf9f7] shadow-2xl"
          >
            <ModalHeader
              habitName={form.habitName}
              isEditMode={isEditMode}
              onClose={onClose}
              onSave={handleCreate}
            />

            {/* Single-page form replaces wizard */}
            <CreateHabitFormSingle
              habitName={form.habitName}
              onHabitNameChange={handleNameChange}
              timeOfDay={timeOfDay}
              onTimeOfDayChange={handleTimeOfDayChange}
              onSubmit={handleFormSubmit}
              autoFocus={visible && !isEditMode}
            />

            {/* Home indicator bar */}
            <View className="px-6 pb-3 bg-white">
              <View className="flex-row justify-center">
                <View className="h-1 w-32 rounded-full bg-stone-300" />
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Auxiliary modals */}
      <ColorPickerSheet
        value={form.selectedColor}
        visible={form.isColorPickerVisible}
        onClose={form.closeColorPicker}
        onSelect={form.setSelectedColor}
      />
      <TemplateScienceModal
        template={science.template}
        visible={science.isVisible}
        onClose={science.close}
        onUseTemplate={science.useTemplate}
      />
    </Modal>
  );
}
