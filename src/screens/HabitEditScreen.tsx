import { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronLeft, Trash2, ChevronDown } from 'lucide-react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  cancelHabitReminder,
  createDateFromTimeString,
  ensureNotificationPermissions,
  formatReminderTime,
  getDefaultReminderTime,
  scheduleHabitReminder,
} from '../utils/notifications';
import { EmojiPickerSheet } from '../components/EmojiPickerV2';

interface HabitEditScreenProps {
  visible: boolean;
  habitId: Id<'habits'> | null;
  onClose: () => void;
}

const EMOJI_COLORS = [
  '#DBEAFE', // blue-100
  '#FFEDD5', // orange-100
  '#DCFCE7', // green-100
  '#F3E8FF', // purple-100
  '#FCE7F3', // pink-100
  '#FEF3C7', // yellow-100
  '#E0E7FF', // indigo-100
  '#CCFBF1', // teal-100
  '#FEE2E2', // red-100
  '#F3F4F6', // gray-100
];

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TIMES = ['morning', 'afternoon', 'evening'];
const TIME_ICONS = ['☀️', '☁️', '🌙'];

const GOAL_UNITS = ['minutes', 'hours', 'times', 'pages', 'reps'];

export default function HabitEditScreen({
  visible,
  habitId,
  onClose,
}: HabitEditScreenProps) {
  // Get habit data
  const habit = useQuery(api.habits.get, habitId ? { habitId } : 'skip');
  const stats = useQuery(api.habits.getStats, habitId ? { habitId } : 'skip');

  // State
  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💪');
  const [selectedColor, setSelectedColor] = useState('#DBEAFE');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]); // M-F
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState<Date>(() => getDefaultReminderTime());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderSound, setReminderSound] = useState('default');
  const [goalValue, setGoalValue] = useState('30');
  const [goalUnit, setGoalUnit] = useState('minutes');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const updateHabit = useMutation(api.habits.update);
  const removeHabit = useMutation(api.habits.remove);

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
      setFrequency((habit.frequency as any) || 'daily');
      setSelectedDays(habit.daysOfWeek || [0, 1, 2, 3, 4]);
      setPreferredTime((habit.preferredTime as any) || 'afternoon');
      setRemindersEnabled(habit.remindersEnabled ?? true);
      setReminderTime(
        createDateFromTimeString(habit.reminderTime, getDefaultReminderTime())
      );
      setReminderSound(habit.reminderSound || 'default');
      setGoalValue(String(habit.goalDuration || 30));
      setGoalUnit(habit.goalUnit || 'minutes');
    }
  }, [habit]);

  const handleSave = async () => {
    if (!habitId || !habitName.trim()) return;

    const trimmedName = habitName.trim();
    const fullName = `${selectedEmoji} ${trimmedName}`;
    const reminderTimeString = formatReminderTime(reminderTime);

    let enableReminders = remindersEnabled;

    if (remindersEnabled) {
      const hasPermission = await ensureNotificationPermissions();
      enableReminders = hasPermission;

      if (hasPermission) {
        const scheduled = await scheduleHabitReminder({
          habitId: String(habitId),
          title: fullName,
          body: 'Time to check in on your habit progress!',
          reminderTime,
          skipPermissionCheck: true,
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
      name: fullName,
      icon: selectedEmoji,
      iconColor: selectedColor,
      frequency,
      daysOfWeek: selectedDays,
      preferredTime,
      remindersEnabled: enableReminders,
      reminderTime: enableReminders ? reminderTimeString : undefined,
      reminderSound: enableReminders ? reminderSound : undefined,
      goalDuration: Number.parseInt(goalValue) || 30,
      goalUnit,
    });

    onClose();
  };

  const handleDelete = async () => {
    if (!habitId) return;
    await removeHabit({ habitId });
    onClose();
  };

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index].sort()
    );
  };

  if (!visible || !habitId) return null;

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-[#f8f5f1]'>
        {/* Header */}
        <View className='flex-row items-center justify-between px-4 pb-4 pt-12'>
          <TouchableOpacity
            accessibilityLabel='Back'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full'
            onPress={onClose}
          >
            <ChevronLeft color='#1a1a1a' size={20} strokeWidth={2} />
          </TouchableOpacity>
          <Text className='text-[17px] font-semibold text-[#1a1a1a]'>
            Edit Habit
          </Text>
          <TouchableOpacity
            accessibilityLabel='Delete'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full'
            onPress={handleDelete}
          >
            <Trash2 color='#ef4444' size={20} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
          {/* Icon Selection Section */}
          <View className='mb-4 rounded-2xl bg-white p-6'>
            {/* Large Icon Preview */}
            <View className='mb-6 items-center'>
              <View
                className='mb-3 h-20 w-20 items-center justify-center rounded-2xl'
                style={{ backgroundColor: selectedColor }}
              >
                <Text className='text-[36px]'>{selectedEmoji}</Text>
              </View>
              <Text className='text-[17px] font-semibold text-[#1a1a1a]'>
                Choose Icon
              </Text>
            </View>

            {/* Icon Selector Button */}
            <TouchableOpacity
              accessibilityLabel='Choose icon'
              accessibilityRole='button'
              className='flex-row items-center justify-between rounded-xl bg-gray-50 p-4'
              onPress={() => setIsEmojiPickerVisible(true)}
            >
              <Text className='text-base font-medium text-[#1a1a1a]'>
                Browse Icons
              </Text>
              <Text className='text-sm text-[#3B82F6]'>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Habit Name Section */}
          <View className='mb-4 rounded-2xl bg-white p-4'>
            <Text className='mb-2 text-base font-semibold text-[#1a1a1a]'>
              Habit Name
            </Text>
            <TextInput
              className='h-12 rounded-xl bg-gray-50 px-4 text-base text-[#1a1a1a]'
              placeholder='e.g., Read 10 minutes'
              placeholderTextColor='#adaebc'
              value={habitName}
              onChangeText={setHabitName}
            />
          </View>

          {/* Frequency Section */}
          <View className='mb-4 rounded-2xl bg-white p-4'>
            <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
              Frequency
            </Text>
            <View className='flex-row gap-3'>
              {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  className={`flex-1 h-12 items-center justify-center rounded-xl ${
                    frequency === freq ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setFrequency(freq)}
                >
                  <Text
                    className={`text-base font-medium capitalize ${
                      frequency === freq ? 'text-white' : 'text-[#1a1a1a]'
                    }`}
                  >
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Days of Week Section */}
          <View className='mb-4 rounded-2xl bg-white p-4'>
            <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
              Days of Week
            </Text>
            <View className='flex-row justify-between'>
              {DAYS.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  className={`h-10 w-10 items-center justify-center rounded-xl ${
                    selectedDays.includes(index) ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                  onPress={() => toggleDay(index)}
                >
                  <Text
                    className={`text-base font-semibold ${
                      selectedDays.includes(index) ? 'text-white' : 'text-[#1a1a1a]'
                    }`}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preferred Time Section */}
          <View className='mb-4 rounded-2xl bg-white p-4'>
            <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
              Preferred Time
            </Text>
            <View className='flex-row gap-3'>
              {TIMES.map((time, index) => (
                <TouchableOpacity
                  key={time}
                  className={`flex-1 h-17 items-center justify-center rounded-xl ${
                    preferredTime === time ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setPreferredTime(time as any)}
                >
                  <Text className='text-xl mb-1'>{TIME_ICONS[index]}</Text>
                  <Text
                    className={`text-sm font-medium capitalize ${
                      preferredTime === time ? 'text-white' : 'text-[#1a1a1a]'
                    }`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reminders Section */}
          <View className='mb-4 rounded-2xl bg-white p-4'>
            <View className='mb-4 flex-row items-center justify-between'>
              <Text className='text-base font-semibold text-[#1a1a1a]'>
                Reminders
              </Text>
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor='#FFFFFF'
                ios_backgroundColor='#D1D5DB'
              />
            </View>

            {remindersEnabled && (
              <>
                <TouchableOpacity
                  className='mb-3 flex-row items-center justify-between rounded-xl bg-gray-50 px-3 h-12'
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text className='text-base font-medium text-[#1a1a1a]'>
                    Reminder Time
                  </Text>
                  <Text className='text-base font-semibold text-blue-500'>
                    {formatReminderTime(reminderTime)}
                  </Text>
                </TouchableOpacity>

                <View className='flex-row items-center justify-between rounded-xl bg-gray-50 px-3 h-12'>
                  <Text className='text-base font-medium text-[#1a1a1a]'>
                    Sound
                  </Text>
                  <TouchableOpacity>
                    <Text className='text-base font-semibold text-blue-500 capitalize'>
                      {reminderSound}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Goal Section */}
          <View className='mb-4 rounded-2xl bg-white p-4'>
            <Text className='mb-2 text-base font-semibold text-[#1a1a1a]'>
              Goal (Optional)
            </Text>
            <View className='flex-row gap-3'>
              <TextInput
                className='flex-1 h-12 rounded-xl bg-gray-50 px-4 text-base text-[#1a1a1a]'
                placeholder='30'
                placeholderTextColor='#adaebc'
                keyboardType='numeric'
                value={goalValue}
                onChangeText={setGoalValue}
              />
              <View className='h-12 w-28 flex-row items-center rounded-xl bg-gray-50 px-3'>
                <Text className='flex-1 text-base text-[#1a1a1a]'>
                  {goalUnit}
                </Text>
                <ChevronDown color='#8a8a8a' size={20} />
              </View>
            </View>
          </View>

          {/* Current Streak Section */}
          <View className='mb-6 rounded-2xl bg-white p-4'>
            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center gap-3'>
                <View className='h-12 w-12 items-center justify-center rounded-xl bg-orange-100'>
                  <Text className='text-xl'>🔥</Text>
                </View>
                <View>
                  <Text className='text-base font-semibold text-[#1a1a1a]'>
                    Current Streak
                  </Text>
                  <Text className='text-sm text-[#8a8a8a]'>Keep it going!</Text>
                </View>
              </View>
              <View className='items-end'>
                <Text className='text-2xl font-bold text-orange-500'>
                  {stats?.streak || 0}
                </Text>
                <Text className='text-sm text-[#8a8a8a]'>days</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode='time'
            is24Hour={false}
            display='spinner'
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                setReminderTime(selectedTime);
              }
            }}
          />
        )}

        {/* Bottom Buttons */}
        <View className='flex-row gap-3 px-4 pb-8 pt-4 bg-[#f8f5f1]'>
          <TouchableOpacity
            className='flex-1 h-14 items-center justify-center rounded-2xl bg-gray-200'
            onPress={onClose}
          >
            <Text className='text-base font-semibold text-[#1a1a1a]'>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 h-14 items-center justify-center rounded-2xl bg-[#1a1a1a]'
            onPress={handleSave}
          >
            <Text className='text-base font-semibold text-white'>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <EmojiPickerSheet
        visible={isEmojiPickerVisible}
        selectedEmoji={selectedEmoji}
        habitName={habitName}
        onSelect={(emoji) => {
          if (emoji !== null) {
            setSelectedEmoji(emoji);
            // Optionally cycle through colors when selecting emoji
            const randomColorIndex = Math.floor(Math.random() * EMOJI_COLORS.length);
            setSelectedColor(EMOJI_COLORS[randomColorIndex]);
          }
        }}
        onClose={() => setIsEmojiPickerVisible(false)}
      />
    </Modal>
  );
}
