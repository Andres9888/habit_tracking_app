import { memo, useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X } from 'lucide-react-native';
import { CreateHabitFormCentered } from './components/CreateHabitFormCentered';
import { useCreateHabitForm } from '../../hooks/useCreateHabitForm';
import { COLORS } from './constants';
import { CustomColorPicker } from './components/CustomColorPicker';
import useHapticFeedback from '../../hooks/useHapticFeedback';

interface CreateHabitModalCenteredProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (habitData: {
    name: string;
    emoji: string | null;
    color: string;
    dayPhase: string;
    reminderTime: Date | null;
    remindersEnabled: boolean;
    frequency: number[];
  }) => void;
}

/**
 * Centered habit creation modal with optional fields
 *
 * Features:
 * - Centered name input with prominent heading
 * - Optional emoji, color, and reminder fields below
 * - Smart defaults reduce friction
 * - Swipe-to-dismiss gesture
 * - Full keyboard handling
 */
const CreateHabitModalCenteredComponent = ({
  visible,
  onClose,
  onCreate,
}: CreateHabitModalCenteredProps) => {
  const insets = useSafeAreaInsets();
  const form = useCreateHabitForm();
  const { triggerSelection } = useHapticFeedback();

  // Modal state
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Swipe-to-dismiss gesture
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      form.reset();
      translateY.value = 0;
    }
  }, [visible, form, translateY]);

  const handleCreate = useCallback(() => {
    if (form.habitName.trim().length < 2) return;

    triggerSelection();

    onCreate({
      name: form.habitName.trim(),
      emoji: form.selectedEmoji,
      color: form.selectedColor,
      dayPhase: form.dayPhase,
      reminderTime: form.remindersEnabled ? form.reminderTime : null,
      remindersEnabled: form.remindersEnabled,
      frequency: form.frequency,
    });

    // Reset form
    form.reset();
    onClose();
  }, [form, onCreate, onClose, triggerSelection]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleCustomColorSelect = useCallback(
    (color: string) => {
      form.setSelectedColor(color);
      setShowCustomColorPicker(false);
    },
    [form]
  );

  const handleReminderTimePress = useCallback(() => {
    setShowTimePicker(true);
  }, []);

  const handleTimeChange = useCallback(
    (event: any, selectedDate?: Date) => {
      setShowTimePicker(Platform.OS === 'ios');
      if (selectedDate) {
        form.setReminderTime(selectedDate);
      }
    },
    [form]
  );

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const canSubmit = form.habitName.trim().length >= 2;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <GestureDetector gesture={panGesture}>
            <Animated.View
              className="flex-1 bg-stone-50"
              style={animatedStyle}
            >
              {/* Header */}
              <View
                className="bg-white border-b border-stone-200"
                style={{ paddingTop: insets.top || 16 }}
              >
                <View className="flex-row items-center justify-between px-6 py-4">
                  <Text className="text-xl font-semibold text-stone-900">
                    Create Habit
                  </Text>
                  <Pressable
                    onPress={handleClose}
                    className="h-8 w-8 items-center justify-center rounded-full bg-stone-100"
                  >
                    <X size={20} color="#78716c" />
                  </Pressable>
                </View>
              </View>

              {/* Form */}
              <CreateHabitFormCentered
                habitName={form.habitName}
                onHabitNameChange={form.setHabitName}
                selectedEmoji={form.selectedEmoji}
                onEmojiSelect={form.setSelectedEmoji}
                colors={COLORS}
                selectedColor={form.selectedColor}
                onColorSelect={form.setSelectedColor}
                onCustomColorPress={() => setShowCustomColorPicker(true)}
                reminderEnabled={form.remindersEnabled}
                reminderTime={formatTime(form.reminderTime)}
                onReminderToggle={form.setRemindersEnabled}
                onReminderTimePress={handleReminderTimePress}
                onSubmit={handleCreate}
                autoFocus={true}
              />

              {/* Footer with Create button */}
              <View
                className="bg-white border-t border-stone-200 px-6"
                style={{ paddingBottom: insets.bottom || 24, paddingTop: 16 }}
              >
                <Pressable
                  onPress={handleCreate}
                  disabled={!canSubmit}
                  className={`rounded-2xl py-4 ${
                    canSubmit ? 'bg-emerald-500' : 'bg-stone-300'
                  }`}
                >
                  <Text
                    className={`text-center text-lg font-semibold ${
                      canSubmit ? 'text-white' : 'text-stone-500'
                    }`}
                  >
                    {canSubmit ? 'Create Habit' : 'Enter a habit name'}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            value={form.reminderTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </Modal>

      {/* Custom Color Picker Modal */}
      <CustomColorPicker
        visible={showCustomColorPicker}
        currentColor={form.selectedColor}
        onClose={() => setShowCustomColorPicker(false)}
        onSelectColor={handleCustomColorSelect}
      />
    </>
  );
};

export const CreateHabitModalCentered = memo(CreateHabitModalCenteredComponent);
