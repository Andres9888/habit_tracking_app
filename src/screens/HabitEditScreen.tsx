import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, Check, AlertTriangle, Archive } from 'lucide-react-native';
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
import { COLORS } from '../components/CreateHabitModal/constants';
import { Motion } from '../constants/motion';
import useHapticFeedback from '../hooks/useHapticFeedback';

interface HabitEditScreenProps {
  visible: boolean;
  habitId: Id<'habits'> | null;
  onClose: () => void;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TIMES = ['morning', 'afternoon', 'evening'];
const TIME_ICONS = ['☀️', '☁️', '🌙'];

const GOAL_UNITS = [
  { value: 'minutes', label: 'Minutes', icon: '⏱️' },
  { value: 'hours', label: 'Hours', icon: '🕐' },
  { value: 'times', label: 'Times', icon: '🔄' },
  { value: 'pages', label: 'Pages', icon: '📖' },
  { value: 'reps', label: 'Reps', icon: '💪' },
  { value: 'steps', label: 'Steps', icon: '👟' },
  { value: 'glasses', label: 'Glasses', icon: '🥛' },
];

// SectionCard component for consistent visual hierarchy
interface SectionCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

const SectionCard = ({ title, icon, children }: SectionCardProps) => (
  <View className="rounded-2xl bg-white p-4">
    <Text className="mb-4 text-base font-bold text-slate-800">
      {icon ? `${icon} ${title}` : title}
    </Text>
    {children}
  </View>
);

// Animated color button component for color picker
interface AnimatedColorButtonProps {
  color: string;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedColorButton = ({
  color,
  isSelected,
  onPress,
}: AnimatedColorButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const wasSelected = useRef(isSelected);

  useEffect(() => {
    if (isSelected && !wasSelected.current) {
      Animated.sequence([
        Animated.timing(scale, {
          duration: Motion.duration.fast,
          easing: Motion.easing.outEase,
          toValue: 1.15,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 12,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
    wasSelected.current = isSelected;
  }, [isSelected, scale]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  // Check if color is very light (needs visible border)
  const isLightColor = color.toUpperCase() === '#FFFFFF' || color.toUpperCase() === '#FFF';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Select color ${color}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        style={{
          alignItems: 'center',
          backgroundColor: color,
          borderColor: isSelected ? '#1e293b' : (isLightColor ? '#e2e8f0' : 'transparent'),
          borderRadius: 20,
          borderWidth: isSelected ? 3 : (isLightColor ? 1 : 0),
          height: 40,
          justifyContent: 'center',
          width: 40,
        }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {isSelected && (
          <Check
            color={isLightColor || ['#EAB308', '#FBBF24', '#4ADE80', '#FB923C'].includes(color) ? '#1e293b' : '#FFFFFF'}
            size={16}
            strokeWidth={3}
          />
        )}
      </Pressable>
    </Animated.View>
  );
};

export default function HabitEditScreen({
  visible,
  habitId,
  onClose,
}: HabitEditScreenProps) {
  const insets = useSafeAreaInsets();
  const { triggerSelection } = useHapticFeedback();

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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showArchiveConfirmation, setShowArchiveConfirmation] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

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

  const handleArchive = async () => {
    if (!habitId) return;
    await archiveHabit({ habitId });
    onClose();
  };

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index].sort()
    );
  };

  const handleColorSelect = useCallback((color: string) => {
    triggerSelection();
    setSelectedColor(color);
  }, [triggerSelection]);

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
        <View className='flex-row items-center justify-between px-4 pb-4' style={{ paddingTop: insets.top + 8 }}>
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
          {/* Empty spacer for layout balance - delete moved to Danger Zone */}
          <View className='h-10 w-10' />
        </View>

        <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
          {/* Section: Identity - Icon, Color, and Name */}
          <View className="gap-4 mb-4">
            <SectionCard title="Style it" icon="🎨">
              {/* Large Icon Preview */}
              <View className='mb-5 items-center'>
                <View
                  className='mb-3 h-20 w-20 items-center justify-center rounded-2xl'
                  style={{ backgroundColor: selectedColor }}
                >
                  <Text className='text-[36px]'>{selectedEmoji}</Text>
                </View>
              </View>

              {/* Icon Selector Button */}
              <TouchableOpacity
                accessibilityLabel='Choose icon'
                accessibilityRole='button'
                className='mb-5 flex-row items-center justify-between rounded-xl bg-gray-50 p-4'
                onPress={() => setIsEmojiPickerVisible(true)}
              >
                <View className='flex-row items-center gap-3'>
                  <View
                    className='h-12 w-12 items-center justify-center rounded-xl'
                    style={{ backgroundColor: selectedColor + '33' }}
                  >
                    <Text className='text-2xl'>{selectedEmoji}</Text>
                  </View>
                  <View>
                    <Text className='text-base font-medium text-slate-800'>Icon</Text>
                    <Text className='text-xs text-slate-500'>Tap to change</Text>
                  </View>
                </View>
                <Text className='text-sm text-[#3B82F6]'>Change</Text>
              </TouchableOpacity>

              {/* Color Picker */}
              <View>
                <Text className='mb-3 text-sm font-semibold text-slate-600'>Color</Text>
                <View className='flex-row flex-wrap gap-3'>
                  {COLORS.map((color) => (
                    <AnimatedColorButton
                      key={color}
                      color={color}
                      isSelected={selectedColor === color}
                      onPress={() => handleColorSelect(color)}
                    />
                  ))}
                </View>
              </View>
            </SectionCard>

            <SectionCard title="Name" icon="✏️">
              <TextInput
                className='h-12 rounded-xl bg-gray-50 px-4 text-base text-[#1a1a1a]'
                placeholder='e.g., Read 10 minutes'
                placeholderTextColor='#adaebc'
                value={habitName}
                onChangeText={setHabitName}
              />
            </SectionCard>
          </View>

          {/* Section: Schedule - Frequency, Days, Time of Day */}
          <View className="gap-4 mb-4">
            <SectionCard title="Schedule" icon="📅">
              {/* Frequency */}
              <View className='mb-5'>
                <Text className='mb-3 text-sm font-semibold text-slate-600'>
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

              {/* Days of Week */}
              <View className='mb-5'>
                <Text className='mb-3 text-sm font-semibold text-slate-600'>
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

              {/* Preferred Time */}
              <View>
                <Text className='mb-3 text-sm font-semibold text-slate-600'>
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
            </SectionCard>
          </View>

          {/* Section: Reminders */}
          <View className="gap-4 mb-4">
            <SectionCard title="Reminders" icon="🔔">
              <View className='-mt-2 flex-row items-center justify-between'>
                <Text className='text-sm font-semibold text-slate-600'>
                  Enable Reminders
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
                <View className='mt-4'>
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
                </View>
              )}
            </SectionCard>
          </View>

          {/* Section: Goals */}
          <View className="gap-4 mb-4">
            <SectionCard title="Goals" icon="🎯">
              <View className='-mt-2'>
                <Text className='mb-3 text-sm font-semibold text-slate-600'>
                  Daily Goal (Optional)
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
                  <TouchableOpacity
                    accessibilityLabel={`Select goal unit, currently ${goalUnit}`}
                    accessibilityRole='button'
                    className='h-12 w-28 flex-row items-center rounded-xl bg-gray-50 px-3'
                    onPress={() => {
                      triggerSelection();
                      setShowUnitPicker(true);
                    }}
                  >
                    <Text className='flex-1 text-base text-[#1a1a1a] capitalize'>
                      {goalUnit}
                    </Text>
                    <ChevronDown color='#3B82F6' size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </SectionCard>
          </View>

          {/* Section: Stats */}
          <View className="gap-4 mb-6">
            <SectionCard title="Stats" icon="📊">
              <View className='-mt-2 flex-row items-center justify-between'>
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
            </SectionCard>
          </View>

          {/* Section: Manage */}
          <View className="gap-4 mb-4">
            <SectionCard title="Manage" icon="⚙️">
              <TouchableOpacity
                accessibilityLabel="Archive habit"
                accessibilityRole="button"
                className="flex-row items-center justify-between rounded-xl bg-amber-50 border border-amber-200 px-4 py-4"
                onPress={() => {
                  triggerSelection();
                  setShowArchiveConfirmation(true);
                }}
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                    <Archive color="#d97706" size={20} strokeWidth={2} />
                  </View>
                  <View>
                    <Text className="text-base font-semibold text-amber-800">Archive Habit</Text>
                    <Text className="text-xs text-amber-600">Hide from home, keep your data</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </SectionCard>
          </View>

          {/* Section: Danger Zone */}
          <View className="gap-4 mb-6">
            <View className="rounded-2xl bg-red-50 border border-red-200 p-4">
              <View className="flex-row items-center gap-2 mb-4">
                <AlertTriangle color="#ef4444" size={18} strokeWidth={2} />
                <Text className="text-base font-bold text-red-600">
                  Danger Zone
                </Text>
              </View>
              <Text className="text-sm text-red-600/70 mb-4">
                Once you delete a habit, all associated data including streaks and history will be permanently removed.
              </Text>
              <TouchableOpacity
                accessibilityLabel="Delete habit"
                accessibilityRole="button"
                className="h-12 items-center justify-center rounded-xl bg-red-500"
                onPress={() => setShowDeleteConfirmation(true)}
              >
                <Text className="text-base font-semibold text-white">
                  Delete Habit
                </Text>
              </TouchableOpacity>
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
            // Color is now explicitly controlled via color picker - no random assignment
          }
        }}
        onClose={() => setIsEmojiPickerVisible(false)}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        transparent
        animationType="fade"
        visible={showDeleteConfirmation}
        onRequestClose={() => setShowDeleteConfirmation(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="mx-6 w-full max-w-sm rounded-2xl bg-white p-6">
            <View className="mb-4 items-center">
              <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle color="#ef4444" size={28} strokeWidth={2} />
              </View>
              <Text className="text-lg font-bold text-slate-800">
                Delete '{habitName || 'this habit'}'?
              </Text>
            </View>
            <Text className="mb-6 text-center text-sm text-slate-500">
              This action cannot be undone. All your progress, streaks, and history for this habit will be permanently deleted.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                accessibilityLabel="Cancel delete"
                accessibilityRole="button"
                className="flex-1 h-12 items-center justify-center rounded-xl bg-gray-100"
                onPress={() => setShowDeleteConfirmation(false)}
              >
                <Text className="text-base font-semibold text-slate-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Confirm delete"
                accessibilityRole="button"
                className="flex-1 h-12 items-center justify-center rounded-xl bg-red-500"
                onPress={() => {
                  setShowDeleteConfirmation(false);
                  handleDelete();
                }}
              >
                <Text className="text-base font-semibold text-white">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Archive Confirmation Dialog */}
      <Modal
        transparent
        animationType="fade"
        visible={showArchiveConfirmation}
        onRequestClose={() => setShowArchiveConfirmation(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="mx-6 w-full max-w-sm rounded-2xl bg-white p-6">
            <View className="mb-4 items-center">
              <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                <Archive color="#d97706" size={28} strokeWidth={2} />
              </View>
              <Text className="text-lg font-bold text-slate-800">
                Archive '{habitName || 'this habit'}'?
              </Text>
            </View>
            <Text className="mb-6 text-center text-sm text-slate-500">
              This habit will be hidden from your home screen but all your progress, streaks, and history will be preserved. You can restore it anytime from Settings.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                accessibilityLabel="Cancel archive"
                accessibilityRole="button"
                className="flex-1 h-12 items-center justify-center rounded-xl bg-gray-100"
                onPress={() => setShowArchiveConfirmation(false)}
              >
                <Text className="text-base font-semibold text-slate-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Confirm archive"
                accessibilityRole="button"
                className="flex-1 h-12 items-center justify-center rounded-xl bg-amber-500"
                onPress={() => {
                  setShowArchiveConfirmation(false);
                  handleArchive();
                }}
              >
                <Text className="text-base font-semibold text-white">
                  Archive
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Goal Unit Picker Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showUnitPicker}
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowUnitPicker(false)}
        >
          <Pressable
            className="rounded-t-3xl bg-white"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <View className="items-center py-3">
              <View className="h-1 w-10 rounded-full bg-gray-300" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pb-4">
              <Text className="text-lg font-bold text-slate-800">
                Select Unit
              </Text>
              <TouchableOpacity
                accessibilityLabel="Close unit picker"
                accessibilityRole="button"
                onPress={() => setShowUnitPicker(false)}
              >
                <Text className="text-base font-semibold text-blue-500">
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            {/* Unit Options */}
            <View className="px-4 pb-8">
              {GOAL_UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit.value}
                  accessibilityLabel={`Select ${unit.label} as goal unit`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: goalUnit === unit.value }}
                  className={`mb-2 flex-row items-center justify-between rounded-xl px-4 py-4 ${
                    goalUnit === unit.value ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
                  }`}
                  onPress={() => {
                    triggerSelection();
                    setGoalUnit(unit.value);
                    setShowUnitPicker(false);
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-xl">{unit.icon}</Text>
                    <Text className={`text-base font-medium ${
                      goalUnit === unit.value ? 'text-blue-600' : 'text-slate-800'
                    }`}>
                      {unit.label}
                    </Text>
                  </View>
                  {goalUnit === unit.value && (
                    <Check color="#3B82F6" size={20} strokeWidth={3} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
}
