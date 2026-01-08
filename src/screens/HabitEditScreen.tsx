import { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, Archive } from 'lucide-react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import {
  cancelHabitReminder,
  createDateFromTimeString,
  ensureNotificationPermissions,
  formatReminderTime,
  getDefaultReminderTime,
  scheduleHabitReminder,
} from '../utils/notifications';
import { EmojiPicker } from '../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../components/CreateHabitModal/components/EnhancedReminderSelector';
import { HABIT_COLORS } from '../components/CreateHabitModal/constants';
import useHapticFeedback from '../hooks/useHapticFeedback';

interface HabitEditScreenProps {
  visible: boolean;
  habitId: Id<'habits'> | null;
  onClose: () => void;
}

export default function HabitEditScreen({
  visible,
  habitId,
  onClose,
}: HabitEditScreenProps) {
  const insets = useSafeAreaInsets();
  const { triggerSelection, triggerSuccess } = useHapticFeedback();

  // Get habit data
  const habit = useQuery(api.habits.get, habitId ? { habitId } : 'skip');

  // State - Only name, emoji, color, and reminder
  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>('💪');
  const [selectedColor, setSelectedColor] = useState('#DBEAFE');
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(() =>
    getDefaultReminderTime()
  );

  const updateHabit = useMutation(api.habits.update);
  const removeHabit = useMutation(api.habits.remove);
  const archiveHabit = useMutation(api.habits.archive);

  // Initialize state from habit data
  useEffect(() => {
    if (habit) {
      // Extract emoji and name from habit name (format: "💪 Exercise")
      const parts = habit.name.split(' ');
      const emoji = parts[0];
      const name = parts.slice(1).join(' ');

      setHabitName(name || habit.name);
      setSelectedEmoji(emoji || '💪');
      setSelectedColor(habit.iconColor || '#DBEAFE');
      setRemindersEnabled(habit.remindersEnabled ?? false);
      setReminderTime(
        createDateFromTimeString(habit.reminderTime, getDefaultReminderTime())
      );
    }
  }, [habit]);

  const handleSave = useCallback(async () => {
    if (!habitId || !habitName.trim()) return;

    const trimmedName = habitName.trim();
    const fullName = selectedEmoji
      ? `${selectedEmoji} ${trimmedName}`
      : trimmedName;
    const reminderTimeString = formatReminderTime(reminderTime);

    let enableReminders = remindersEnabled;

    if (remindersEnabled) {
      const hasPermission = await ensureNotificationPermissions();
      enableReminders = hasPermission;

      if (hasPermission) {
        const scheduled = await scheduleHabitReminder({
          body: 'Time to check in on your habit progress!',
          habitId: String(habitId),
          reminderTime,
          skipPermissionCheck: true,
          title: fullName,
        });
        enableReminders = scheduled;
      }

      if (!enableReminders) {
        await cancelHabitReminder(String(habitId));
        Alert.alert(
          'Notifications Disabled',
          'Enable notifications in your device settings to receive habit reminders.'
        );
      }
    } else {
      await cancelHabitReminder(String(habitId));
    }

    await updateHabit({
      habitId,
      icon: selectedEmoji ?? undefined,
      iconColor: selectedColor,
      name: fullName,
      remindersEnabled: enableReminders,
      reminderSound: enableReminders ? 'default' : undefined,
      reminderTime: enableReminders ? reminderTimeString : undefined,
    });

    triggerSuccess();
    onClose();
  }, [
    habitId,
    habitName,
    selectedEmoji,
    selectedColor,
    remindersEnabled,
    reminderTime,
    updateHabit,
    triggerSuccess,
    onClose,
  ]);

  const handleDelete = useCallback(() => {
    if (!habitId) return;

    Alert.alert(
      'Delete Habit',
      'This action cannot be undone. All your progress and history will be permanently deleted.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            void removeHabit({ habitId }).then(() => {
              triggerSelection();
              onClose();
            });
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  }, [habitId, removeHabit, triggerSelection, onClose]);

  const handleArchive = useCallback(() => {
    if (!habitId) return;

    Alert.alert(
      'Archive Habit',
      'This habit will be hidden but your progress will be preserved. You can restore it anytime from Settings.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            void archiveHabit({ habitId }).then(() => {
              triggerSelection();
              onClose();
            });
          },
          text: 'Archive',
        },
      ]
    );
  }, [habitId, archiveHabit, triggerSelection, onClose]);

  const handleEmojiSelect = useCallback((emoji: string | null) => {
    setSelectedEmoji(emoji);
  }, []);

  const handleColorSelect = useCallback(
    (color: string) => {
      triggerSelection();
      setSelectedColor(color);
    },
    [triggerSelection]
  );

  const handleReminderToggle = useCallback((enabled: boolean) => {
    setRemindersEnabled(enabled);
  }, []);

  const handleReminderTimeChange = useCallback((time: Date) => {
    setReminderTime(time);
  }, []);

  if (!visible || !habitId) {
    return null;
  }

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
      <View className='flex-1 bg-stone-50'>
        {/* Header */}
        <View
          className='flex-row items-center justify-between border-b border-stone-200 bg-stone-50 px-4 pb-3'
          style={{ paddingTop: insets.top + 8 }}
        >
          <Pressable
            accessibilityLabel='Cancel'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full'
            onPress={() => {
              triggerSelection();
              onClose();
            }}
          >
            <ChevronLeft color='#1c1917' size={24} strokeWidth={2} />
          </Pressable>

          <Pressable
            accessibilityLabel='Save changes'
            accessibilityRole='button'
            className='rounded-full bg-stone-900 px-4 py-2'
            onPress={() => void handleSave()}
          >
            <Text className='text-sm font-semibold text-white'>Save</Text>
          </Pressable>
        </View>

        <ScrollView
          className='flex-1'
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={Keyboard.dismiss}>
            <View className='flex-1 px-6'>
              {/* Name Input Section */}
              <View
                className='items-center'
                style={{ marginBottom: 32, marginTop: 32 }}
              >
                <Text className='mb-3 text-center text-2xl font-bold text-stone-900'>
                  Edit your habit
                </Text>

                <TextInput
                  className='w-full rounded-2xl border-2 border-stone-200 bg-white px-6 py-5 text-center text-xl text-stone-900'
                  maxLength={50}
                  placeholder='e.g., Read for 20 minutes'
                  placeholderTextColor='#A8A29E'
                  returnKeyType='done'
                  value={habitName}
                  onChangeText={setHabitName}
                  onSubmitEditing={Keyboard.dismiss}
                />

                {/* Character counter */}
                <Text className='mt-2 text-xs text-stone-400'>
                  {habitName.length}/50 characters
                </Text>
              </View>

              {/* Customize Section */}
              <View className='flex-1'>
                {/* Section label */}
                <Text
                  className='mb-4 text-center text-xs font-semibold text-stone-500'
                  style={{ letterSpacing: 0.5 }}
                >
                  CUSTOMIZE
                </Text>

                {/* Emoji picker */}
                <EmojiPicker
                  hideLabel
                  habitName={habitName}
                  selectedEmoji={selectedEmoji}
                  onSelect={handleEmojiSelect}
                />

                {/* Color picker */}
                <ColorPickerSection
                  hideLabel
                  colors={HABIT_COLORS}
                  selectedColor={selectedColor}
                  onSelectColor={handleColorSelect}
                />

                {/* Reminder selector */}
                <EnhancedReminderSelector
                  enabled={remindersEnabled}
                  reminderTime={reminderTime}
                  onTimeChange={handleReminderTimeChange}
                  onToggle={handleReminderToggle}
                />
              </View>

              {/* Danger Zone */}
              <View className='mt-8 border-t border-stone-200 pt-6'>
                <Text
                  className='mb-4 text-center text-xs font-semibold text-stone-400'
                  style={{ letterSpacing: 0.5 }}
                >
                  MANAGE
                </Text>

                {/* Archive Button */}
                <Pressable
                  accessibilityLabel='Archive habit'
                  accessibilityRole='button'
                  className='mb-3 flex-row items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-4'
                  onPress={handleArchive}
                >
                  <Archive color='#d97706' size={18} strokeWidth={2} />
                  <Text className='text-base font-medium text-amber-700'>
                    Archive Habit
                  </Text>
                </Pressable>

                {/* Delete Button */}
                <Pressable
                  accessibilityLabel='Delete habit'
                  accessibilityRole='button'
                  className='flex-row items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-4'
                  onPress={handleDelete}
                >
                  <Trash2 color='#dc2626' size={18} strokeWidth={2} />
                  <Text className='text-base font-medium text-red-600'>
                    Delete Habit
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}
