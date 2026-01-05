import { useCallback } from 'react';
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
import { CreateHabitFormMinimal } from './components/CreateHabitFormMinimal';

/**
 * Minimal habit creation modal - Name only required
 *
 * UX Benefits:
 * - Absolute fastest: 1 tap (or just Enter key)
 * - Zero decision fatigue: Only name required
 * - Smart defaults: Time, reminder, frequency auto-set
 * - Clean UI: No clutter, just one input field
 *
 * Default Behavior:
 * - Time: Afternoon (phase2_pivot)
 * - Reminder: Enabled at 12:00 PM
 * - Frequency: Daily (all 7 days)
 * - Emoji: Auto-assigned based on habit name keywords
 * - Color: First in palette (or random)
 *
 * Customization:
 * - All settings editable AFTER creation via edit screen
 * - Users can tap habit card → Edit → Change anything
 *
 * Time to Create: ~10 seconds (vs 60s wizard, 30s single-page)
 */

// Swipe dismissal constants
const SWIPE_DISMISS_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 500;

export default function CreateHabitModalMinimal(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, template, science, handleCreate } =
    useCreateHabitModal(props);

  // Swipe dismissal gesture state
  const translateY = useSharedValue(0);
  const context = useSharedValue({ startY: 0 });

  // Pan gesture for swipe-to-dismiss
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { startY: translateY.value };
    })
    .onUpdate((event) => {
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

  const handleFormSubmit = useCallback(() => {
    // Set smart defaults before creating

    // Default time: Afternoon (most common)
    form.setDayPhase('phase2_pivot');

    // Default reminder: Enabled at 12:00 PM
    form.setRemindersEnabled(true);
    const defaultTime = new Date();
    defaultTime.setHours(12, 0, 0, 0);
    form.setReminderTime(defaultTime);

    // Frequency defaults to daily (handled by backend)

    // Auto-assign emoji based on habit name keywords
    const name = form.habitName.toLowerCase();
    const emojiMap: Record<string, string> = {
      read: '📚',
      book: '📚',
      meditate: '🧘',
      meditation: '🧘',
      exercise: '💪',
      workout: '💪',
      gym: '💪',
      run: '🏃',
      running: '🏃',
      jog: '🏃',
      water: '💧',
      hydrate: '💧',
      drink: '💧',
      write: '✍️',
      journal: '✍️',
      gratitude: '🙏',
      yoga: '🧘',
      sleep: '😴',
      stretch: '🤸',
      walk: '🚶',
      code: '💻',
      study: '📖',
      learn: '📖',
      practice: '🎯',
      clean: '🧹',
      cook: '🍳',
      music: '🎵',
      guitar: '🎸',
      piano: '🎹',
      art: '🎨',
      draw: '🎨',
      paint: '🎨',
    };

    // Find matching emoji
    let autoEmoji = null;
    for (const [keyword, emoji] of Object.entries(emojiMap)) {
      if (name.includes(keyword)) {
        autoEmoji = emoji;
        break;
      }
    }

    if (autoEmoji) {
      form.setSelectedEmoji(autoEmoji);
    }

    // Create the habit
    handleCreate();
  }, [form, handleCreate]);

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

            {/* Minimal form - just name input */}
            <CreateHabitFormMinimal
              habitName={form.habitName}
              onHabitNameChange={handleNameChange}
              onSubmit={handleFormSubmit}
              autoFocus={visible && !isEditMode}
            />

            {/* Home indicator bar */}
            <View className="absolute bottom-16 left-0 right-0 px-6">
              <View className="flex-row justify-center">
                <View className="h-1 w-32 rounded-full bg-stone-300" />
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Auxiliary modals (hidden, but kept for compatibility) */}
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
