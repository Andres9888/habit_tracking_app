import { Modal, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { ColorPickerSheet } from './ColorPickerSheet';
import TemplateScienceModal from '../TemplateScienceModal';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { useSwipeDismiss } from './hooks/useSwipeDismiss';
import { useFormHandlers } from './hooks/useFormHandlers';
import { ModalHeader } from './components/ModalHeader';
import { ModalContent } from './components/ModalContent';
import { TemplateReminderPrompt } from './components/TemplateReminderPrompt';
import { StickyCreateBar } from './components/StickyCreateBar';

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, template, science, handleCreate } =
    useCreateHabitModal(props);

  const { panGesture, animatedStyle } = useSwipeDismiss({ onClose });
  const handlers = useFormHandlers(form);

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
            <ModalContent
              habitName={form.habitName}
              isEditMode={isEditMode}
              reminderOption={form.reminderOption}
              reminderTime={form.reminderTime}
              selectedColor={form.selectedColor}
              selectedEmoji={form.selectedEmoji}
              visible={visible}
              onColorSelect={handlers.handleColorSelect}
              onCustomColorPress={form.openColorPicker}
              onEmojiSelect={handlers.handleEmojiSelect}
              onNameChange={handlers.handleNameChange}
              onReminderTimeChange={handlers.handleReminderTimeChange}
              onReminderToggle={handlers.handleReminderToggle}
              onScroll={template.handleMainScroll}
            />
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
