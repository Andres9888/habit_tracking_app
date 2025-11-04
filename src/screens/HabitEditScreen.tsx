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
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { ChevronLeft, Trash2, ChevronDown, Save, CheckCircle } from 'lucide-react-native';
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
import { EmojiPicker } from '../components/EmojiPicker';

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
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [nameError, setNameError] = useState('');

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

  // Track unsaved changes
  useEffect(() => {
    if (habit) {
      const hasChanges =
        habitName !== (habit.name.split(' ').slice(1).join(' ') || habit.name) ||
        selectedEmoji !== (habit.name.split(' ')[0] || '💪') ||
        selectedColor !== (habit.iconColor || '#DBEAFE') ||
        frequency !== (habit.frequency as any) ||
        JSON.stringify(selectedDays.sort()) !== JSON.stringify((habit.daysOfWeek || [0, 1, 2, 3, 4]).sort()) ||
        preferredTime !== (habit.preferredTime as any) ||
        remindersEnabled !== (habit.remindersEnabled ?? true) ||
        reminderTime.getTime() !== createDateFromTimeString(habit.reminderTime, getDefaultReminderTime()).getTime() ||
        reminderSound !== (habit.reminderSound || 'default') ||
        goalValue !== String(habit.goalDuration || 30) ||
        goalUnit !== (habit.goalUnit || 'minutes');

      setHasUnsavedChanges(hasChanges);
    }
  }, [habit, habitName, selectedEmoji, selectedColor, frequency, selectedDays, preferredTime, remindersEnabled, reminderTime, reminderSound, goalValue, goalUnit]);

  const validateHabitName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return 'Habit name is required';
    }
    if (trimmed.length < 2) {
      return 'Habit name must be at least 2 characters';
    }
    if (trimmed.length > 50) {
      return 'Habit name must be less than 50 characters';
    }
    return '';
  };

  const handleHabitNameChange = (text: string) => {
    setHabitName(text);
    const error = validateHabitName(text);
    setNameError(error);
  };

  const handleSave = async () => {
    const nameValidationError = validateHabitName(habitName);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    if (!habitId || !habitName.trim() || isSaving) return;

    setIsSaving(true);
    try {
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

      setHasUnsavedChanges(false);
      onClose();
    } catch (error) {
      Alert.alert(
        'Save Failed',
        'There was an error saving your habit. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!habitId) return;
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeHabit({ habitId });
            onClose();
          }
        }
      ]
    );
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave without saving?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard Changes',
            style: 'destructive',
            onPress: onClose
          }
        ]
      );
    } else {
      onClose();
    }
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
      onRequestClose={handleClose}
      accessible={true}
      accessibilityViewIsModal={true}
      accessibilityLabel='Edit habit modal'
    >
      <View className='flex-1 bg-[#f8f5f1]'>
        {/* Header */}
        <View className='bg-[#f8f5f1] px-4 pb-4 pt-12'>
          <View className='flex-row items-center justify-between mb-3'>
            <TouchableOpacity
              accessibilityLabel='Back'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-white'
              onPress={handleClose}
            >
              <ChevronLeft color='#1a1a1a' size={20} strokeWidth={2} />
            </TouchableOpacity>
            <View className='flex-1 items-center'>
              <Text className='text-[20px] font-bold text-[#1a1a1a]'>
                Edit Habit
              </Text>
              {hasUnsavedChanges && (
                <View className='flex-row items-center mt-1'>
                  <View className='h-2 w-2 rounded-full bg-blue-500 mr-1' />
                  <Text className='text-xs text-blue-600 font-medium'>Unsaved changes</Text>
                </View>
              )}
            </View>
            <View className='w-10' /> {/* Spacer for centering */}
          </View>

          {/* Quick Actions Row */}
          <View className='flex-row justify-end'>
            <TouchableOpacity
              accessibilityLabel='Delete habit'
              accessibilityRole='button'
              className='flex-row items-center px-3 py-2 rounded-lg bg-red-50'
              onPress={handleDelete}
            >
              <Trash2 color='#ef4444' size={16} strokeWidth={2} />
              <Text className='ml-2 text-sm font-medium text-red-600'>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className='flex-1 px-4'
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'
        >
          {/* Habit Identity Section */}
          <View className='mb-4 rounded-2xl bg-white p-6'>
            {/* Combined Icon & Color Preview */}
            <View className='mb-6 items-center'>
              <View
                className='mb-4 h-24 w-24 items-center justify-center rounded-3xl shadow-lg'
                style={{ backgroundColor: selectedColor }}
              >
                <Text className='text-[48px]'>{selectedEmoji}</Text>
              </View>
              <Text className='text-[18px] font-bold text-[#1a1a1a] mb-2'>
                Habit Identity
              </Text>
              <Text className='text-sm text-[#8a8a8a] text-center'>
                Choose an icon and color that represents your habit
              </Text>
            </View>

            {/* Color Picker */}
            <View className='mb-4'>
              <Text className='text-base font-semibold text-[#1a1a1a] mb-3'>
                Color
              </Text>
              <View className='flex-row flex-wrap gap-3'>
                {EMOJI_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    accessibilityLabel={`Select ${color} color`}
                    accessibilityRole='button'
                    className={`h-12 w-12 rounded-2xl border-2 ${
                      selectedColor === color ? 'border-[#1a1a1a]' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            {/* Icon Selector */}
            <TouchableOpacity
              accessibilityLabel='Choose icon'
              accessibilityRole='button'
              className='flex-row items-center justify-between rounded-xl bg-gray-50 p-4'
              onPress={() => setIsEmojiPickerVisible(true)}
            >
              <View className='flex-row items-center'>
                <Text className='text-[24px] mr-3'>{selectedEmoji}</Text>
                <View>
                  <Text className='text-base font-medium text-[#1a1a1a]'>
                    Change Icon
                  </Text>
                  <Text className='text-sm text-[#8a8a8a]'>
                    Browse emoji collection
                  </Text>
                </View>
              </View>
              <Text className='text-sm text-[#3B82F6] font-medium'>Browse</Text>
            </TouchableOpacity>
          </View>

          {/* Habit Details Section */}
          <View className='mb-4 rounded-2xl bg-white p-6'>
            <Text className='text-[18px] font-bold text-[#1a1a1a] mb-4'>
              Habit Details
            </Text>

            {/* Habit Name */}
            <View className='mb-6'>
              <Text className='text-base font-semibold text-[#1a1a1a] mb-2'>
                What will you call this habit?
              </Text>
              <TextInput
                className={`h-14 rounded-xl px-4 text-base text-[#1a1a1a] ${
                  nameError ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                }`}
                placeholder='e.g., Morning meditation, Evening reading'
                placeholderTextColor='#adaebc'
                value={habitName}
                onChangeText={handleHabitNameChange}
                maxLength={50}
                accessibilityLabel='Habit name'
                accessibilityHint='Enter a descriptive name for your habit'
              />
              <View className='flex-row justify-between items-center mt-1'>
                {nameError ? (
                  <Text className='text-xs text-red-600 font-medium'>
                    {nameError}
                  </Text>
                ) : (
                  <Text className='text-xs text-[#8a8a8a]'>
                    {habitName.length}/50 characters
                  </Text>
                )}
                <Text className='text-xs text-[#8a8a8a]'>
                  Required
                </Text>
              </View>
            </View>

            {/* Frequency */}
            <View>
              <Text className='text-base font-semibold text-[#1a1a1a] mb-3'>
                How often will you do this?
              </Text>
              <View className='flex-row gap-3'>
                {[
                  { key: 'daily', label: 'Daily', desc: 'Every day' },
                  { key: 'weekly', label: 'Weekly', desc: 'A few days' },
                  { key: 'custom', label: 'Custom', desc: 'My schedule' },
                ].map(({ key, label, desc }) => (
                  <TouchableOpacity
                    key={key}
                    className={`flex-1 items-center rounded-xl p-4 border-2 ${
                      frequency === key
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onPress={() => setFrequency(key)}
                  >
                    <Text
                      className={`text-base font-semibold mb-1 ${
                        frequency === key ? 'text-blue-700' : 'text-[#1a1a1a]'
                      }`}
                    >
                      {label}
                    </Text>
                    <Text
                      className={`text-xs ${
                        frequency === key ? 'text-blue-600' : 'text-[#8a8a8a]'
                      }`}
                    >
                      {desc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Schedule Section */}
          <View className='mb-4 rounded-2xl bg-white p-6'>
            <Text className='text-[18px] font-bold text-[#1a1a1a] mb-4'>
              Schedule
            </Text>

            {/* Days of Week - Only show for weekly/custom */}
            {(frequency === 'weekly' || frequency === 'custom') && (
              <View className='mb-6'>
                <Text className='text-base font-semibold text-[#1a1a1a] mb-3'>
                  Which days?
                </Text>
                <View className='flex-row justify-between'>
                  {DAYS.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      accessibilityLabel={`Toggle ${day} ${selectedDays.includes(index) ? 'off' : 'on'}`}
                      accessibilityRole='button'
                      accessibilityState={{ selected: selectedDays.includes(index) }}
                      className={`h-12 w-12 items-center justify-center rounded-xl border-2 ${
                        selectedDays.includes(index)
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-gray-50 border-gray-200'
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
                <Text className='text-xs text-[#8a8a8a] mt-2'>
                  {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} selected
                </Text>
              </View>
            )}

            {/* Preferred Time */}
            <View>
              <Text className='text-base font-semibold text-[#1a1a1a] mb-3'>
                When do you prefer to do this?
              </Text>
              <View className='flex-row gap-3'>
                {TIMES.map((time, index) => (
                  <TouchableOpacity
                    key={time}
                    className={`flex-1 items-center rounded-xl p-4 border-2 ${
                      preferredTime === time
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onPress={() => setPreferredTime(time as any)}
                  >
                    <Text className='text-2xl mb-2'>{TIME_ICONS[index]}</Text>
                    <Text
                      className={`text-sm font-semibold capitalize ${
                        preferredTime === time ? 'text-blue-700' : 'text-[#1a1a1a]'
                      }`}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Notifications Section */}
          <View className='mb-4 rounded-2xl bg-white p-6'>
            <Text className='text-[18px] font-bold text-[#1a1a1a] mb-4'>
              Notifications
            </Text>

            <View className='mb-4 flex-row items-center justify-between'>
              <View className='flex-1'>
                <Text className='text-base font-semibold text-[#1a1a1a]'>
                  Smart Reminders
                </Text>
                <Text className='text-sm text-[#8a8a8a]'>
                  Get notified when it's time to build your habit
                </Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor='#FFFFFF'
                ios_backgroundColor='#D1D5DB'
              />
            </View>

            {remindersEnabled && (
              <View className='space-y-3'>
                <TouchableOpacity
                  className='flex-row items-center justify-between rounded-xl bg-gray-50 p-4'
                  onPress={() => setShowTimePicker(true)}
                >
                  <View className='flex-row items-center'>
                    <Text className='text-lg mr-3'>🔔</Text>
                    <View>
                      <Text className='text-base font-medium text-[#1a1a1a]'>
                        Reminder Time
                      </Text>
                      <Text className='text-sm text-[#8a8a8a]'>
                        When to send notifications
                      </Text>
                    </View>
                  </View>
                  <Text className='text-base font-semibold text-blue-500'>
                    {formatReminderTime(reminderTime)}
                  </Text>
                </TouchableOpacity>

                <View className='flex-row items-center justify-between rounded-xl bg-gray-50 p-4'>
                  <View className='flex-row items-center'>
                    <Text className='text-lg mr-3'>🔊</Text>
                    <View>
                      <Text className='text-base font-medium text-[#1a1a1a]'>
                        Sound
                      </Text>
                      <Text className='text-sm text-[#8a8a8a]'>
                        Notification tone
                      </Text>
                    </View>
                  </View>
                  <Text className='text-base font-semibold text-blue-500 capitalize'>
                    {reminderSound}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Goal Section */}
          <View className='mb-4 rounded-2xl bg-white p-6'>
            <Text className='text-[18px] font-bold text-[#1a1a1a] mb-4'>
              Goal Setting
            </Text>

            <Text className='text-base font-semibold text-[#1a1a1a] mb-2'>
              What's your target? (Optional)
            </Text>
            <Text className='text-sm text-[#8a8a8a] mb-4'>
              Set a specific goal to track your progress
            </Text>

            <View className='flex-row gap-3'>
              <View className='flex-1'>
                <TextInput
                  className='h-14 rounded-xl bg-gray-50 px-4 text-base text-[#1a1a1a] text-center font-semibold'
                  placeholder='30'
                  placeholderTextColor='#adaebc'
                  keyboardType='numeric'
                  value={goalValue}
                  onChangeText={setGoalValue}
                  maxLength={4}
                />
              </View>
              <View className='flex-1'>
                <TouchableOpacity className='h-14 flex-row items-center justify-between rounded-xl bg-gray-50 px-4'>
                  <Text className='text-base font-semibold text-[#1a1a1a] capitalize'>
                    {goalUnit}
                  </Text>
                  <ChevronDown color='#8a8a8a' size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {goalValue && (
              <Text className='text-sm text-[#8a8a8a] mt-2 text-center'>
                Goal: {goalValue} {goalUnit} per session
              </Text>
            )}
          </View>

          {/* Progress Overview Section */}
          <View className='mb-6 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 p-6 border border-orange-100'>
            <View className='flex-row items-center justify-between mb-4'>
              <View className='flex-row items-center gap-4'>
                <View className='h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 shadow-lg'>
                  <Text className='text-2xl'>🔥</Text>
                </View>
                <View>
                  <Text className='text-lg font-bold text-[#1a1a1a]'>
                    Current Streak
                  </Text>
                  <Text className='text-sm text-[#8a8a8a]'>
                    {stats?.streak ? 'Keep the momentum going!' : 'Start building your habit today'}
                  </Text>
                </View>
              </View>
            </View>

            <View className='flex-row items-center justify-between'>
              <View className='flex-1'>
                <Text className='text-3xl font-bold text-orange-600 mb-1'>
                  {stats?.streak || 0}
                </Text>
                <Text className='text-sm font-medium text-orange-700'>
                  days in a row
                </Text>
              </View>
              <View className='items-end'>
                <View className='flex-row items-center bg-white/60 rounded-xl px-3 py-2'>
                  <Text className='text-sm font-medium text-[#1a1a1a] mr-2'>
                    Strength
                  </Text>
                  <View className='px-2 py-1 bg-orange-500 rounded-lg'>
                    <Text className='text-xs font-bold text-white'>
                      {habit?.strength ? Math.round(habit.strength) : 0}%
                    </Text>
                  </View>
                </View>
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

        {/* Bottom Action Bar */}
        <View className='bg-white border-t border-gray-200 px-4 py-6'>
          <View className='flex-row gap-3'>
            <TouchableOpacity
              className='flex-1 h-14 items-center justify-center rounded-2xl bg-gray-100 border border-gray-200'
              onPress={handleClose}
              disabled={isSaving}
            >
              <Text className='text-base font-semibold text-[#1a1a1a]'>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 h-14 items-center justify-center rounded-2xl ${
                hasUnsavedChanges
                  ? 'bg-blue-500 shadow-lg'
                  : 'bg-gray-300'
              }`}
              onPress={handleSave}
              disabled={isSaving || !habitName.trim()}
            >
              {isSaving ? (
                <View className='flex-row items-center'>
                  <ActivityIndicator color='white' size='small' />
                  <Text className='text-base font-semibold text-white ml-2'>
                    Saving...
                  </Text>
                </View>
              ) : (
                <View className='flex-row items-center'>
                  {hasUnsavedChanges && <Save size={18} color='white' />}
                  <Text className='text-base font-semibold text-white ml-1'>
                    {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Helper Text */}
          <Text className='text-xs text-[#8a8a8a] text-center mt-3'>
            {hasUnsavedChanges
              ? 'Tap Save Changes to update your habit'
              : 'All changes have been saved'
            }
          </Text>
        </View>
      </View>

      <EmojiPicker
        visible={isEmojiPickerVisible}
        selectedEmoji={selectedEmoji}
        onSelect={(emoji) => {
          setSelectedEmoji(emoji);
          // Optionally cycle through colors when selecting emoji
          const randomColorIndex = Math.floor(Math.random() * EMOJI_COLORS.length);
          setSelectedColor(EMOJI_COLORS[randomColorIndex]);
        }}
        onClose={() => setIsEmojiPickerVisible(false)}
      />
    </Modal>
  );
}
