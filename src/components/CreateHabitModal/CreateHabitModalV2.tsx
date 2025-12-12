import { useCallback, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ColorPickerSheet } from './ColorPickerSheet';
import { COLORS, EMOJIS } from './constants';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { ModalHeader } from './components/ModalHeader';
import { HeroNameInput } from './components/HeroNameInput';
import { LivePreview } from './components/LivePreview';
import { StyleSection } from './components/StyleSection';
import { SimpleReminderSection } from './components/SimpleReminderSection';
import { PremiumTeaser } from './components/PremiumTeaser';
import { StickyCreateBar } from './components/StickyCreateBar';
import { SuccessAnimation } from './components/SuccessAnimation';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { formatReminderTime } from '../../utils/notifications';

// Smart emoji suggestions based on habit name
const getSuggestedEmojis = (habitName: string): string[] => {
  const q = habitName.toLowerCase();

  if (q.includes('read') || q.includes('book')) return ['📖', '📚', '📰', '📝'];
  if (q.includes('meditat') || q.includes('mindful') || q.includes('calm')) return ['🧘', '🙏', '😌', '💭'];
  if (q.includes('run') || q.includes('jog')) return ['🏃', '👟', '🏃‍♀️', '💨'];
  if (q.includes('walk') || q.includes('step')) return ['🚶', '👣', '🚶‍♀️', '🌳'];
  if (q.includes('water') || q.includes('drink') || q.includes('hydrat')) return ['💧', '🥤', '🚰', '💦'];
  if (q.includes('workout') || q.includes('gym') || q.includes('exercise') || q.includes('lift')) return ['💪', '🏋️', '🏋️‍♀️', '⚡'];
  if (q.includes('sleep') || q.includes('bed')) return ['😴', '🛏️', '🌙', '💤'];
  if (q.includes('journal') || q.includes('write') || q.includes('diary')) return ['📝', '✍️', '📓', '🖊️'];
  if (q.includes('grateful') || q.includes('gratitude') || q.includes('thank')) return ['🙏', '💝', '✨', '🌟'];
  if (q.includes('healthy') || q.includes('eat') || q.includes('food')) return ['🍎', '🥗', '🥑', '🍊'];
  if (q.includes('vitamin') || q.includes('supplement')) return ['💊', '🍊', '💉', '🩺'];
  if (q.includes('stretch') || q.includes('yoga')) return ['🧘', '🤸', '🙆', '🧘‍♀️'];
  if (q.includes('bike') || q.includes('cycle')) return ['🚴', '🚲', '🚴‍♀️', '🏔️'];
  if (q.includes('clean') || q.includes('tidy') || q.includes('organiz')) return ['🧹', '🧼', '✨', '🏠'];
  if (q.includes('phone') || q.includes('screen') || q.includes('digital')) return ['📱', '📵', '🔇', '⏰'];
  if (q.includes('study') || q.includes('learn')) return ['📚', '🎓', '🧠', '💡'];
  if (q.includes('music') || q.includes('instrument') || q.includes('guitar') || q.includes('piano')) return ['🎸', '🎹', '🎵', '🎶'];
  if (q.includes('creative') || q.includes('art') || q.includes('draw') || q.includes('paint')) return ['🎨', '✏️', '🖌️', '🖼️'];
  if (q.includes('coffee')) return ['☕', '🫖', '☕', '🌅'];
  if (q.includes('morning') || q.includes('wake')) return ['🌅', '☀️', '⏰', '🌄'];
  if (q.includes('evening') || q.includes('night')) return ['🌙', '🌃', '✨', '🌟'];

  return [];
};

export default function CreateHabitModalV2(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, handleCreate } = useCreateHabitModal(props);
  const { triggerSelection } = useHapticFeedback();

  // Success animation state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    color: string;
    emoji: string | null;
    name: string;
  } | null>(null);

  // Get suggested emojis based on habit name
  const suggestedEmojis = getSuggestedEmojis(form.habitName);

  // Handle create with success animation
  const handleCreateWithAnimation = useCallback(async () => {
    // Store data for success animation
    setSuccessData({
      color: form.selectedColor,
      emoji: form.selectedEmoji,
      name: form.habitName,
    });

    // Trigger the actual create
    await handleCreate();

    // Show success animation
    setShowSuccess(true);
  }, [form.habitName, form.selectedColor, form.selectedEmoji, handleCreate]);

  // Handle success animation complete
  const handleSuccessComplete = useCallback(() => {
    setShowSuccess(false);
    setSuccessData(null);
  }, []);

  // Handle upgrade press (placeholder)
  const handleUpgradePress = useCallback(() => {
    // TODO: Navigate to premium screen
    triggerSelection();
  }, [triggerSelection]);

  return (
    <>
      <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View className="flex-1 bg-black/50">
          <View className="mt-12 flex-1 overflow-hidden rounded-t-3xl bg-slate-50 shadow-2xl">
            {/* Header */}
            <ModalHeader
              habitName={form.habitName}
              isEditMode={isEditMode}
              onClose={onClose}
              onSave={handleCreateWithAnimation}
            />

            {/* Scrollable Content */}
            <ScrollView
              className="flex-1 px-4"
              contentContainerStyle={{ paddingBottom: 160, paddingTop: 16 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* 1. Hero Name Input (FIRST!) */}
              <HeroNameInput
                autoFocus={visible && !isEditMode}
                value={form.habitName}
                onChange={form.setHabitName}
              />

              {/* 2. Live Preview */}
              <LivePreview
                frequencyLabel={form.frequency}
                habitName={form.habitName}
                reminderTime={form.remindersEnabled ? formatReminderTime(form.reminderTime) : undefined}
                selectedColor={form.selectedColor}
                selectedEmoji={form.selectedEmoji}
              />

              {/* 4. Style Section (Emoji + Color - visible, not collapsed) */}
              <StyleSection
                colors={COLORS}
                emojis={EMOJIS}
                selectedColor={form.selectedColor}
                selectedEmoji={form.selectedEmoji}
                suggestedEmojis={suggestedEmojis}
                onCustomColorPress={form.openColorPicker}
                onSelectColor={form.setSelectedColor}
                onSelectEmoji={form.setSelectedEmoji}
              />

              {/* 5. Reminder Section (simplified) */}
              <SimpleReminderSection
                reminderTime={form.reminderTime}
                remindersEnabled={form.remindersEnabled}
                onQuickTimeSelect={form.setReminderTime}
                onTimePress={() => form.setShowTimePicker(true)}
                onToggle={form.setRemindersEnabled}
              />

              {/* 6. Premium Teaser (AI Suggestions) */}
              <PremiumTeaser habitName={form.habitName} onUpgrade={handleUpgradePress} />
            </ScrollView>

            {/* Sticky Create Bar */}
            <StickyCreateBar
              disabled={!form.habitName.trim().length}
              onPress={handleCreateWithAnimation}
            />

            {/* Time Picker */}
            {form.showTimePicker && (
              <DateTimePicker
                display="spinner"
                is24Hour={false}
                mode="time"
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

        {/* Color Picker Sheet */}
        <ColorPickerSheet
          presetColors={COLORS}
          value={form.selectedColor}
          visible={form.isColorPickerVisible}
          onClose={form.closeColorPicker}
          onSelect={form.setSelectedColor}
        />
      </Modal>

      {/* Success Animation */}
      {successData && (
        <SuccessAnimation
          habitName={successData.name}
          selectedColor={successData.color}
          selectedEmoji={successData.emoji}
          visible={showSuccess}
          onComplete={handleSuccessComplete}
        />
      )}
    </>
  );
}
