import { useCallback } from 'react';
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
import { ModalHeader } from './components/ModalHeader';
import { TemplateReminderPrompt } from './components/TemplateReminderPrompt';
import { HabitNameField } from './components/HabitNameField';
import { LivePreview } from './components/LivePreview';
import { EmojiPicker } from './components/EmojiPicker';
import { ColorPickerSection } from './components/ColorPickerSection';
import { StickyCreateBar } from './components/StickyCreateBar';
import { EnhancedReminderSelector } from './components/EnhancedReminderSelector';
// V9: TemplatesLinkSection removed from modal for focused flow (component retained for potential future use)

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

  const handleReminderToggle = useCallback(
    (enabled: boolean) => {
      // Toggle by setting 'none' or using smart default
      if (enabled) {
        // When enabling, use the existing reminderTime's hour to pick a phase
        // or default to morning
        const hour = form.reminderTime.getHours();
        if (hour >= 5 && hour < 10) {
          form.setReminderOption('morning');
        } else if (hour >= 10 && hour < 16) {
          form.setReminderOption('midday');
        } else {
          form.setReminderOption('evening');
        }
      } else {
        form.setReminderOption('none');
      }
    },
    [form]
  );

  const handleReminderTimeChange = useCallback(
    (time: Date) => {
      form.setReminderTime(time);
      // Also enable reminders if not already enabled
      if (form.reminderOption === 'none') {
        // Pick phase based on the new time
        const hour = time.getHours();
        if (hour >= 5 && hour < 10) {
          form.setReminderOption('morning');
        } else if (hour >= 10 && hour < 16) {
          form.setReminderOption('midday');
        } else {
          form.setReminderOption('evening');
        }
      }
    },
    [form]
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
            className='flex-1 overflow-hidden rounded-t-3xl bg-[#faf9f7] shadow-2xl'
            style={animatedStyle}
          >
            <ModalHeader
              habitName={form.habitName}
              isEditMode={isEditMode}
              onClose={onClose}
              onSave={handleCreate}
            />
            <ScrollView
              className='flex-1 px-4'
              contentContainerStyle={{ paddingBottom: isEditMode ? 32 : 160 }}
              keyboardShouldPersistTaps='handled'
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              onScroll={template.handleMainScroll}
            >
              {/* V11: Progressive spacing - Input (mb-3), Emojis (mb-4), Colors (mb-5), Reminders (mb-6) */}
              <Animated.View
                entering={FadeInUp.duration(ANIMATION_DURATION).delay(0)}
              >
                <View className='mt-4' />
                <HabitNameField
                  autoFocus={visible && !isEditMode}
                  value={form.habitName}
                  onChange={handleNameChange}
                />
                {/* V11: Live Preview positioned between input and emoji picker */}
                <LivePreview
                  color={form.selectedColor}
                  emoji={form.selectedEmoji}
                  habitName={form.habitName}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                  ANIMATION_STAGGER_DELAY
                )}
              >
                <EmojiPicker
                  habitName={form.habitName}
                  selectedEmoji={form.selectedEmoji}
                  onSelect={handleEmojiSelect}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                  ANIMATION_STAGGER_DELAY * 2
                )}
              >
                <ColorPickerSection
                  colors={HABIT_COLORS}
                  selectedColor={form.selectedColor}
                  onCustomPress={form.openColorPicker}
                  onSelectColor={handleColorSelect}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                  ANIMATION_STAGGER_DELAY * 3
                )}
              >
                <EnhancedReminderSelector
                  enabled={form.reminderOption !== 'none'}
                  reminderTime={form.reminderTime}
                  onTimeChange={handleReminderTimeChange}
                  onToggle={handleReminderToggle}
                />
              </Animated.View>
              {/* V9: Templates Link Section removed for focused flow */}
            </ScrollView>
            <TemplateReminderPrompt
              bottomOffset={template.reminderBottomOffset}
              visible={template.shouldShowTemplateReminder}
              onPress={template.handleReminderPress}
            />
            <StickyCreateBar
              disabled={form.habitName.trim().length < 2}
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
