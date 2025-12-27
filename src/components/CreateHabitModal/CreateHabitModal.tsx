import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ColorPickerSheet } from './ColorPickerSheet';
import TemplateScienceModal from '../TemplateScienceModal';
import { HABIT_COLORS } from './constants';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { ModalHeader } from './components/ModalHeader';
import { TemplateReminderPrompt } from './components/TemplateReminderPrompt';
import { HabitPreview } from './components/HabitPreview';
import { HabitNameField } from './components/HabitNameField';
import { EmojiPicker } from './components/EmojiPicker';
import { ColorPickerSection } from './components/ColorPickerSection';
import { ReminderSection } from './components/ReminderSection';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { StickyCreateBar } from './components/StickyCreateBar';
import {
  QuickPicksRow,
  type QuickPickTemplate,
} from './components/QuickPicksRow';
import {
  TimeOfDaySelector,
  getReminderTimeForPhase,
} from './components/TimeOfDaySelector';
import type { HubermanPhase } from '../../constants/hubermanPhases';

// Stagger delay between section animations (ms)
const ANIMATION_STAGGER_DELAY = 50;
// Base animation duration (ms)
const ANIMATION_DURATION = 300;

// Height offset to scroll past quick picks section to show form
const QUICK_PICKS_SECTION_HEIGHT = 180;

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, template, science, handleCreate } =
    useCreateHabitModal(props);
  const { triggerSelection } = useHapticFeedback();
  const [selectedQuickPickId, setSelectedQuickPickId] = useState<string | null>(
    null
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const handleQuickPickSelect = useCallback(
    (quickPick: QuickPickTemplate) => {
      setSelectedQuickPickId(quickPick.id);
      form.setHabitName(quickPick.name);
      form.setSelectedEmoji(quickPick.emoji);
      form.setSelectedColor(quickPick.color);
      form.setDayPhase(quickPick.timeOfDay);

      // Auto-enable reminders with appropriate time for the selected template
      const reminderTime = getReminderTimeForPhase(quickPick.timeOfDay);
      form.setReminderTime(reminderTime);
      form.setRemindersEnabled(true);

      // Scroll to form section after selection with a small delay for smoother UX
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          animated: true,
          y: QUICK_PICKS_SECTION_HEIGHT,
        });
      }, 100);
    },
    [form]
  );

  // Clear quick pick selection when user manually modifies any field
  const handleNameChange = useCallback(
    (value: string) => {
      setSelectedQuickPickId(null);
      form.setHabitName(value);
    },
    [form]
  );

  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      setSelectedQuickPickId(null);
      form.setSelectedEmoji(emoji);
    },
    [form]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedQuickPickId(null);
      form.setSelectedColor(color);
    },
    [form]
  );

  const handleTimeOfDaySelect = useCallback(
    (phase: HubermanPhase) => {
      setSelectedQuickPickId(null);
      form.setDayPhase(phase);
      // Auto-set reminder time based on selected phase
      const reminderTime = getReminderTimeForPhase(phase);
      form.setReminderTime(reminderTime);
      // Auto-enable reminders when time of day is selected
      form.setRemindersEnabled(true);
    },
    [form]
  );

  // Reset quick pick selection when modal opens (for new habit creation)
  useEffect(() => {
    if (visible && !isEditMode) {
      setSelectedQuickPickId(null);
    }
  }, [visible, isEditMode]);

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50'>
        <View className='flex-1 overflow-hidden rounded-t-3xl bg-[#faf9f7] shadow-2xl'>
          <ModalHeader
            habitName={form.habitName}
            isEditMode={isEditMode}
            onClose={onClose}
            onSave={handleCreate}
          />
          <ScrollView
            ref={scrollViewRef}
            className='flex-1 px-4'
            contentContainerStyle={{ paddingBottom: isEditMode ? 32 : 160 }}
            keyboardShouldPersistTaps='handled'
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={template.handleMainScroll}
          >
            {/* Quick Picks Section - hidden in edit mode */}
            {!isEditMode && (
              <Animated.View
                entering={FadeInUp.duration(ANIMATION_DURATION).delay(0)}
              >
                <View className='mt-3' />
                <QuickPicksRow
                  selectedTemplateId={selectedQuickPickId}
                  onSelectTemplate={handleQuickPickSelect}
                />
                {/* Divider */}
                <View className='mb-4 flex-row items-center'>
                  <View className='h-px flex-1 bg-[#e7e5e4]' />
                  <Text className='mx-4 text-xs font-medium text-[#a8a29e]'>
                    or create your own
                  </Text>
                  <View className='h-px flex-1 bg-[#e7e5e4]' />
                </View>
              </Animated.View>
            )}
            <Animated.View
              entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                ANIMATION_STAGGER_DELAY
              )}
            >
              <HabitPreview
                habitName={form.habitName}
                selectedColor={form.selectedColor}
                selectedEmoji={form.selectedEmoji}
                timeOfDay={form.dayPhase}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                ANIMATION_STAGGER_DELAY * 2
              )}
            >
              <HabitNameField
                autoFocus={visible && !isEditMode}
                value={form.habitName}
                onChange={handleNameChange}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                ANIMATION_STAGGER_DELAY * 3
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
                ANIMATION_STAGGER_DELAY * 4
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
                ANIMATION_STAGGER_DELAY * 5
              )}
            >
              <TimeOfDaySelector
                selectedPhase={form.dayPhase}
                onSelectPhase={handleTimeOfDaySelect}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInUp.duration(ANIMATION_DURATION).delay(
                ANIMATION_STAGGER_DELAY * 6
              )}
            >
              <ReminderSection
                remindersEnabled={form.remindersEnabled}
                reminderTime={form.reminderTime}
                onTimePress={() => form.setShowTimePicker(true)}
                onToggle={form.setRemindersEnabled}
              />
            </Animated.View>
          </ScrollView>
          <TemplateReminderPrompt
            bottomOffset={template.reminderBottomOffset}
            visible={template.shouldShowTemplateReminder}
            onPress={template.handleReminderPress}
          />
          <StickyCreateBar
            disabled={form.habitName.trim().length === 0}
            selectedColor={form.selectedColor}
            onPress={handleCreate}
          />
          {form.showTimePicker && (
            <DateTimePicker
              display='spinner'
              is24Hour={false}
              mode='time'
              value={form.reminderTime}
              onChange={(_event, selected) => {
                form.setShowTimePicker(false);
                if (selected) {
                  triggerSelection();
                  form.setReminderTime(selected);
                }
              }}
            />
          )}
        </View>
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
