import { useCallback, useMemo, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ColorPickerSheet } from './ColorPickerSheet';
import TemplateScienceModal from '../TemplateScienceModal';
import { HABIT_COLORS } from './constants';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { ModalHeaderV1 } from './components/ModalHeaderV1';
import { TemplateReminderPrompt } from './components/TemplateReminderPrompt';
import { BasicInfoCard } from './components/BasicInfoCard';
import { AppearanceCard } from './components/AppearanceCard';
import { ScheduleCard } from './components/ScheduleCard';
import { LivePreviewCard } from './components/LivePreviewCard';
import { StickyCreateBar } from './components/StickyCreateBar';
import { useFormCompletion } from './hooks/useFormCompletion';
import { formatReminderTime } from '../../utils/notifications';
// V9: TemplatesLinkSection removed from modal for focused flow (component retained for potential future use)
// Cards V1: Switched to card-based components with progress tracking

// Stagger delay between section animations (ms)
const ANIMATION_STAGGER_DELAY = 50;
// Base animation duration (ms)
const ANIMATION_DURATION = 300;
// V11: Swipe dismissal constants
const SWIPE_DISMISS_THRESHOLD = 100; // pixels
const SWIPE_VELOCITY_THRESHOLD = 500; // pixels per second

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, template, science, handleCreate } =
    useCreateHabitModal(props);

  // Cards V1: Selected days state (Sun-Sat boolean array)
  // Default: Daily (all days selected)
  const [selectedDays, setSelectedDays] = useState<boolean[]>([
    true, true, true, true, true, true, true,
  ]);

  // Cards V1: Form completion tracking
  const completion = useFormCompletion(
    form.habitName,
    form.selectedEmoji,
    form.selectedColor,
    selectedDays
  );

  // V11: Swipe dismissal gesture state
  const translateY = useSharedValue(0);
  const context = useSharedValue({ startY: 0 });

  // V11: Pan gesture for swipe-to-dismiss
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
        // Dismiss modal
        runOnJS(onClose)();
        // Reset position for next open
        translateY.value = 0;
      } else {
        // Spring back to original position
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
      }
    });

  // V11: Animated style for swipe translation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Cards V1: Callback handlers for card components
  const handleNameChange = useCallback(
    (value: string) => {
      form.setHabitName(value);
    },
    [form]
  );

  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      form.setSelectedEmoji(emoji);
    },
    [form]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      form.setSelectedColor(color);
    },
    [form]
  );

  const handleTimeOfDayChange = useCallback(
    (phase: typeof form.dayPhase) => {
      form.setDayPhase(phase);
    },
    [form]
  );

  const handleReminderToggle = useCallback(
    (enabled: boolean) => {
      form.setRemindersEnabled(enabled);
    },
    [form]
  );

  const handleReminderTimePress = useCallback(() => {
    form.setShowTimePicker(true);
  }, [form]);

  const handleFrequencyChange = useCallback((days: boolean[]) => {
    setSelectedDays(days);
  }, []);

  // Format reminder time for display
  const reminderTimeString = useMemo(
    () => formatReminderTime(form.reminderTime),
    [form.reminderTime]
  );

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50'>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={animatedStyle}
            className='flex-1 overflow-hidden rounded-t-3xl bg-[#faf9f7] shadow-2xl'
          >
            {/* Cards V1: New header with progress tracking */}
            <ModalHeaderV1
              onClose={onClose}
              completedSections={completion.completedCount}
              totalSections={completion.totalCount}
            />
            <ScrollView
              className='flex-1 px-4'
              contentContainerStyle={{ paddingBottom: isEditMode ? 32 : 160 }}
              keyboardShouldPersistTaps='handled'
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              onScroll={template.handleMainScroll}
            >
            {/* Cards V1: Live Preview Card - shows real-time habit preview */}
            <Animated.View
              entering={FadeInUp.duration(ANIMATION_DURATION).delay(0)}
            >
              <LivePreviewCard
                habitName={form.habitName}
                emoji={form.selectedEmoji}
                color={form.selectedColor}
                timeOfDay={form.dayPhase}
                selectedDays={selectedDays}
                reminderEnabled={form.remindersEnabled}
                reminderTime={reminderTimeString}
              />
            </Animated.View>

            {/* Cards V1: Basic Info Card - habit name input */}
            <Animated.View
              entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                ANIMATION_STAGGER_DELAY
              )}
            >
              <BasicInfoCard
                habitName={form.habitName}
                onHabitNameChange={handleNameChange}
                isComplete={completion.basicInfoComplete}
                autoFocus={visible && !isEditMode}
              />
            </Animated.View>

            {/* Cards V1: Appearance Card - emoji and color selection */}
            <Animated.View
              entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                ANIMATION_STAGGER_DELAY * 2
              )}
            >
              <AppearanceCard
                selectedEmoji={form.selectedEmoji}
                selectedColor={form.selectedColor}
                habitName={form.habitName}
                colors={HABIT_COLORS}
                onEmojiChange={handleEmojiSelect}
                onColorChange={handleColorSelect}
                onCustomColorPress={form.openColorPicker}
                isComplete={completion.appearanceComplete}
              />
            </Animated.View>

            {/* Cards V1: Schedule Card - time, reminder, frequency */}
            <Animated.View
              entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                ANIMATION_STAGGER_DELAY * 3
              )}
            >
              <ScheduleCard
                timeOfDay={form.dayPhase}
                reminderEnabled={form.remindersEnabled}
                reminderTime={reminderTimeString}
                selectedDays={selectedDays}
                onTimeOfDayChange={handleTimeOfDayChange}
                onReminderToggle={handleReminderToggle}
                onReminderTimePress={handleReminderTimePress}
                onFrequencyChange={handleFrequencyChange}
                isComplete={completion.scheduleComplete}
              />
            </Animated.View>
          </ScrollView>
          <TemplateReminderPrompt
            bottomOffset={template.reminderBottomOffset}
            visible={template.shouldShowTemplateReminder}
            onPress={template.handleReminderPress}
          />
          {/* Cards V1: Updated to use completion state instead of just habit name */}
          <StickyCreateBar
            disabled={!completion.isFormComplete}
            selectedColor={form.selectedColor}
            onPress={handleCreate}
          />
        </Animated.View>
      </GestureDetector>
      </View>
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
