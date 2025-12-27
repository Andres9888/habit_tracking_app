import { useCallback } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ColorPickerSheet } from './ColorPickerSheet';
import TemplateScienceModal from '../TemplateScienceModal';
import { HABIT_COLORS } from './constants';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { ModalHeader } from './components/ModalHeader';
import { TemplateReminderPrompt } from './components/TemplateReminderPrompt';
import { HabitNameField } from './components/HabitNameField';
import { EmojiPicker } from './components/EmojiPicker';
import { ColorPickerSection } from './components/ColorPickerSection';
import { StickyCreateBar } from './components/StickyCreateBar';
import {
  ReminderSelector,
  type ReminderOption,
} from './components/ReminderSelector';
// V9: TemplatesLinkSection removed from modal for focused flow (component retained for potential future use)

// Stagger delay between section animations (ms)
const ANIMATION_STAGGER_DELAY = 50;
// Base animation duration (ms)
const ANIMATION_DURATION = 300;

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, template, science, handleCreate } =
    useCreateHabitModal(props);

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

  const handleReminderSelect = useCallback(
    (option: ReminderOption) => {
      form.setReminderOption(option);
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
        <View className='flex-1 overflow-hidden rounded-t-3xl bg-[#faf9f7] shadow-2xl'>
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
            {/* V9 Layout: Name input first (hero position), no QuickPicks */}
            <Animated.View
              entering={FadeInUp.duration(ANIMATION_DURATION).delay(0)}
            >
              <View className='mt-4' />
              <HabitNameField
                autoFocus={visible && !isEditMode}
                value={form.habitName}
                onChange={handleNameChange}
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
              <ReminderSelector
                selectedOption={form.reminderOption}
                onSelectOption={handleReminderSelect}
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
            disabled={form.habitName.trim().length === 0}
            selectedColor={form.selectedColor}
            onPress={handleCreate}
          />
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
