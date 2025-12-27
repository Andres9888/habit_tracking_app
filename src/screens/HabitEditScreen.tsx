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
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Check,
  AlertTriangle,
  Archive,
  MapPin,
  MessageCircle,
  Eye,
} from 'lucide-react-native';
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
  /** Optional callback to navigate to Cue & Intention editor */
  onOpenCueEditor?: () => void;
  /** Optional callback to navigate to Affirmations editor */
  onOpenAffirmationsEditor?: () => void;
  /** Optional callback to navigate to Vision Board */
  onOpenVisionBoard?: () => void;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TIMES = ['morning', 'afternoon', 'evening'];
const TIME_ICONS = ['☀️', '☁️', '🌙'];

const GOAL_UNITS = [
  { icon: '⏱️', label: 'Minutes', value: 'minutes' },
  { icon: '🕐', label: 'Hours', value: 'hours' },
  { icon: '🔄', label: 'Times', value: 'times' },
  { icon: '📖', label: 'Pages', value: 'pages' },
  { icon: '💪', label: 'Reps', value: 'reps' },
  { icon: '👟', label: 'Steps', value: 'steps' },
  { icon: '🥛', label: 'Glasses', value: 'glasses' },
];

// SectionCard component for consistent visual hierarchy
interface SectionCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

const SectionCard = ({ title, icon, children }: SectionCardProps) => (
  <View className='rounded-2xl bg-white p-4'>
    <Text className='mb-4 text-base font-bold text-stone-800'>
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
          damping: 12,
          stiffness: 180,
          toValue: 1,
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
  const isLightColor =
    color.toUpperCase() === '#FFFFFF' || color.toUpperCase() === '#FFF';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Select color ${color}`}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        style={{
          alignItems: 'center',
          backgroundColor: color,
          borderColor: isSelected
            ? '#292524'
            : isLightColor
              ? '#e7e5e4'
              : 'transparent',
          borderRadius: 20,
          borderWidth: isSelected ? 3 : isLightColor ? 1 : 0,
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
            color={
              isLightColor ||
              ['#EAB308', '#FBBF24', '#4ADE80', '#FB923C'].includes(color)
                ? '#292524'
                : '#FFFFFF'
            }
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
  onOpenCueEditor,
  onOpenAffirmationsEditor,
  onOpenVisionBoard,
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
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>(
    'daily'
  );
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]); // M-F
  const [preferredTime, setPreferredTime] = useState<
    'morning' | 'afternoon' | 'evening'
  >('afternoon');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState<Date>(() =>
    getDefaultReminderTime()
  );
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
      daysOfWeek: selectedDays,
      frequency,
      goalDuration: Number.parseInt(goalValue) || 30,
      goalUnit,
      habitId,
      icon: selectedEmoji,
      iconColor: selectedColor,
      name: fullName,
      preferredTime,
      remindersEnabled: enableReminders,
      reminderSound: enableReminders ? reminderSound : undefined,
      reminderTime: enableReminders ? reminderTimeString : undefined,
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
      prev.includes(index)
        ? prev.filter((d) => d !== index)
        : [...prev, index].sort()
    );
  };

  const handleColorSelect = useCallback(
    (color: string) => {
      triggerSelection();
      setSelectedColor(color);
    },
    [triggerSelection]
  );

  if (!visible || !habitId) {
    console.log(
      '[HabitEditScreen] Not rendering - visible:',
      visible,
      'habitId:',
      habitId
    );
    return null;
  }

  console.log('[HabitEditScreen] Rendering with habitId:', habitId);

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
      <View className='flex-1 bg-[#faf9f7]'>
        {/* Header */}
        <View
          className='flex-row items-center justify-between px-4 pb-4'
          style={{ paddingTop: insets.top + 8 }}
        >
          <TouchableOpacity
            accessibilityLabel='Back'
            accessibilityRole='button'
            className='h-10 w-10 items-center justify-center rounded-full'
            onPress={() => {
              triggerSelection();
              onClose();
            }}
          >
            <ChevronLeft color='#1a1a1a' size={20} strokeWidth={2} />
          </TouchableOpacity>
          <Text className='text-[17px] font-semibold text-[#1a1a1a]'>
            Edit Habit
          </Text>
          {/* Empty spacer for layout balance - delete moved to Danger Zone */}
          <View className='h-10 w-10' />
        </View>

        <ScrollView
          className='flex-1 px-4'
          showsVerticalScrollIndicator={false}
        >
          {/* Section: Identity - Icon, Color, and Name */}
          <View className='mb-4 gap-4'>
            <SectionCard icon='🎨' title='Style it'>
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
                className='mb-5 flex-row items-center justify-between rounded-xl bg-stone-50 p-4'
                onPress={() => {
                  triggerSelection();
                  setIsEmojiPickerVisible(true);
                }}
              >
                <View className='flex-row items-center gap-3'>
                  <View
                    className='h-12 w-12 items-center justify-center rounded-xl'
                    style={{ backgroundColor: selectedColor + '33' }}
                  >
                    <Text className='text-2xl'>{selectedEmoji}</Text>
                  </View>
                  <View>
                    <Text className='text-base font-medium text-stone-800'>
                      Icon
                    </Text>
                    <Text className='text-[13px] font-normal text-stone-500'>
                      Tap to change
                    </Text>
                  </View>
                </View>
                <Text className='text-sm text-[#3B82F6]'>Change</Text>
              </TouchableOpacity>

              {/* Color Picker */}
              <View>
                <Text className='mb-3 text-sm font-semibold text-stone-600'>
                  Color
                </Text>
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

            <SectionCard icon='✏️' title='Name'>
              <TextInput
                autoCorrect
                blurOnSubmit
                autoCapitalize='sentences'
                className='h-12 rounded-xl bg-stone-50 px-4 text-base text-[#1a1a1a]'
                placeholder='e.g., Read 10 minutes'
                placeholderTextColor='#a8a29e'
                returnKeyType='done'
                value={habitName}
                onChangeText={setHabitName}
              />
            </SectionCard>
          </View>

          {/* Section: Schedule - Frequency, Days, Time of Day */}
          <View className='mb-4 gap-4'>
            <SectionCard icon='📅' title='Schedule'>
              {/* Frequency */}
              <View className='mb-5'>
                <Text className='mb-3 text-sm font-semibold text-stone-600'>
                  Frequency
                </Text>
                <View className='flex-row gap-3'>
                  {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      className={`h-12 flex-1 items-center justify-center rounded-xl ${
                        frequency === freq ? 'bg-blue-500' : 'bg-stone-100'
                      }`}
                      onPress={() => {
                        triggerSelection();
                        setFrequency(freq);
                      }}
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
                <Text className='mb-3 text-sm font-semibold text-stone-600'>
                  Days of Week
                </Text>
                <View className='flex-row justify-between'>
                  {DAYS.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`h-10 w-10 items-center justify-center rounded-xl ${
                        selectedDays.includes(index)
                          ? 'bg-blue-500'
                          : 'bg-stone-100'
                      }`}
                      onPress={() => {
                        triggerSelection();
                        toggleDay(index);
                      }}
                    >
                      <Text
                        className={`text-base font-semibold ${
                          selectedDays.includes(index)
                            ? 'text-white'
                            : 'text-[#1a1a1a]'
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
                <Text className='mb-3 text-sm font-semibold text-stone-600'>
                  Preferred Time
                </Text>
                <View className='flex-row gap-3'>
                  {TIMES.map((time, index) => (
                    <TouchableOpacity
                      key={time}
                      className={`h-17 flex-1 items-center justify-center rounded-xl ${
                        preferredTime === time ? 'bg-blue-500' : 'bg-stone-100'
                      }`}
                      onPress={() => {
                        triggerSelection();
                        setPreferredTime(time as any);
                      }}
                    >
                      <Text className='mb-1 text-xl'>{TIME_ICONS[index]}</Text>
                      <Text
                        className={`text-sm font-medium capitalize ${
                          preferredTime === time
                            ? 'text-white'
                            : 'text-[#1a1a1a]'
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
          <View className='mb-4 gap-4'>
            <SectionCard icon='🔔' title='Reminders'>
              <View className='-mt-2 flex-row items-center justify-between'>
                <Text className='text-sm font-semibold text-stone-600'>
                  Enable Reminders
                </Text>
                <Switch
                  ios_backgroundColor='#D1D5DB'
                  thumbColor='#FFFFFF'
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  value={remindersEnabled}
                  onValueChange={(value) => {
                    triggerSelection();
                    setRemindersEnabled(value);
                  }}
                />
              </View>

              {remindersEnabled && (
                <View className='mt-4'>
                  <TouchableOpacity
                    className='mb-3 h-12 flex-row items-center justify-between rounded-xl bg-stone-50 px-3'
                    onPress={() => {
                      triggerSelection();
                      setShowTimePicker(true);
                    }}
                  >
                    <Text className='text-base font-medium text-[#1a1a1a]'>
                      Reminder Time
                    </Text>
                    <Text className='text-base font-semibold text-blue-500'>
                      {formatReminderTime(reminderTime)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className='h-12 flex-row items-center justify-between rounded-xl bg-stone-50 px-3'
                    onPress={() => {
                      triggerSelection();
                      // Sound picker would be implemented here
                    }}
                  >
                    <Text className='text-base font-medium text-[#1a1a1a]'>
                      Sound
                    </Text>
                    <Text className='text-base font-semibold capitalize text-blue-500'>
                      {reminderSound}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </SectionCard>
          </View>

          {/* Section: Goals */}
          <View className='mb-4 gap-4'>
            <SectionCard icon='🎯' title='Goals'>
              <View className='-mt-2'>
                <Text className='mb-3 text-sm font-semibold text-stone-600'>
                  Daily Goal (Optional)
                </Text>
                <View className='flex-row gap-3'>
                  <TextInput
                    blurOnSubmit
                    className='h-12 flex-1 rounded-xl bg-stone-50 px-4 text-base text-[#1a1a1a]'
                    keyboardType='numeric'
                    placeholder='30'
                    placeholderTextColor='#a8a29e'
                    returnKeyType='done'
                    value={goalValue}
                    onChangeText={setGoalValue}
                  />
                  <TouchableOpacity
                    accessibilityLabel={`Select goal unit, currently ${goalUnit}`}
                    accessibilityRole='button'
                    className='h-12 w-28 flex-row items-center rounded-xl bg-stone-50 px-3'
                    onPress={() => {
                      triggerSelection();
                      setShowUnitPicker(true);
                    }}
                  >
                    <Text className='flex-1 text-base capitalize text-[#1a1a1a]'>
                      {goalUnit}
                    </Text>
                    <ChevronDown color='#3B82F6' size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </SectionCard>
          </View>

          {/* Section: Stats */}
          <View className='mb-6 gap-4'>
            <SectionCard icon='📊' title='Stats'>
              <View className='-mt-2 flex-row items-center justify-between'>
                <View className='flex-row items-center gap-3'>
                  <View className='h-12 w-12 items-center justify-center rounded-xl bg-orange-100'>
                    <Text className='text-xl'>🔥</Text>
                  </View>
                  <View>
                    <Text className='text-base font-semibold text-stone-800'>
                      Current Streak
                    </Text>
                    <Text className='text-[13px] font-normal text-stone-500'>
                      Keep it going!
                    </Text>
                  </View>
                </View>
                <View className='items-end'>
                  <Text className='text-2xl font-bold text-orange-500'>
                    {stats?.streak || 0}
                  </Text>
                  <Text className='text-[13px] font-normal text-stone-500'>
                    days
                  </Text>
                </View>
              </View>
            </SectionCard>
          </View>

          {/* Section: Advanced Features */}
          {(onOpenCueEditor ||
            onOpenAffirmationsEditor ||
            onOpenVisionBoard) && (
            <View className='mb-4 gap-4'>
              <SectionCard icon='✨' title='Advanced'>
                <View className='-mt-2 gap-2'>
                  {/* Edit Cue & Intention */}
                  {onOpenCueEditor && (
                    <TouchableOpacity
                      accessibilityLabel='Edit cue and intention'
                      accessibilityRole='button'
                      className='flex-row items-center justify-between rounded-xl bg-stone-50 px-4 py-3'
                      onPress={() => {
                        triggerSelection();
                        onOpenCueEditor();
                      }}
                    >
                      <View className='flex-row items-center gap-3'>
                        <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
                          <MapPin color='#d97706' size={20} strokeWidth={2} />
                        </View>
                        <View>
                          <Text className='text-base font-medium text-stone-800'>
                            Edit Cue & Intention
                          </Text>
                          <Text className='text-[13px] font-normal text-stone-500'>
                            Set when and where to do this habit
                          </Text>
                        </View>
                      </View>
                      <ChevronRight color='#a8a29e' size={20} strokeWidth={2} />
                    </TouchableOpacity>
                  )}

                  {/* Edit Affirmations */}
                  {onOpenAffirmationsEditor && (
                    <TouchableOpacity
                      accessibilityLabel='Edit affirmations'
                      accessibilityRole='button'
                      className='flex-row items-center justify-between rounded-xl bg-stone-50 px-4 py-3'
                      onPress={() => {
                        triggerSelection();
                        onOpenAffirmationsEditor();
                      }}
                    >
                      <View className='flex-row items-center gap-3'>
                        <View className='h-10 w-10 items-center justify-center rounded-xl bg-violet-100'>
                          <MessageCircle
                            color='#7c3aed'
                            size={20}
                            strokeWidth={2}
                          />
                        </View>
                        <View>
                          <Text className='text-base font-medium text-stone-800'>
                            Edit Affirmations
                          </Text>
                          <Text className='text-[13px] font-normal text-stone-500'>
                            Positive self-talk for motivation
                          </Text>
                        </View>
                      </View>
                      <ChevronRight color='#a8a29e' size={20} strokeWidth={2} />
                    </TouchableOpacity>
                  )}

                  {/* View Why & Vision Board */}
                  {onOpenVisionBoard && (
                    <TouchableOpacity
                      accessibilityLabel='View why and vision board'
                      accessibilityRole='button'
                      className='flex-row items-center justify-between rounded-xl bg-stone-50 px-4 py-3'
                      onPress={() => {
                        triggerSelection();
                        onOpenVisionBoard();
                      }}
                    >
                      <View className='flex-row items-center gap-3'>
                        <View className='h-10 w-10 items-center justify-center rounded-xl bg-rose-100'>
                          <Eye color='#e11d48' size={20} strokeWidth={2} />
                        </View>
                        <View>
                          <Text className='text-base font-medium text-stone-800'>
                            View Why & Vision Board
                          </Text>
                          <Text className='text-[13px] font-normal text-stone-500'>
                            Your motivation and goals
                          </Text>
                        </View>
                      </View>
                      <ChevronRight color='#a8a29e' size={20} strokeWidth={2} />
                    </TouchableOpacity>
                  )}
                </View>
              </SectionCard>
            </View>
          )}

          {/* Section: Manage */}
          <View className='mb-4 gap-4'>
            <SectionCard icon='⚙️' title='Manage'>
              <TouchableOpacity
                accessibilityLabel='Archive habit'
                accessibilityRole='button'
                className='flex-row items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-4'
                onPress={() => {
                  triggerSelection();
                  setShowArchiveConfirmation(true);
                }}
              >
                <View className='flex-row items-center gap-3'>
                  <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
                    <Archive color='#d97706' size={20} strokeWidth={2} />
                  </View>
                  <View>
                    <Text className='text-base font-semibold text-amber-800'>
                      Archive Habit
                    </Text>
                    <Text className='text-[13px] font-normal text-amber-600'>
                      Hide from home, keep your data
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </SectionCard>
          </View>

          {/* Section: Danger Zone */}
          <View className='mb-6 gap-4'>
            <View className='rounded-2xl border border-red-200 bg-red-50 p-4'>
              <View className='mb-4 flex-row items-center gap-2'>
                <AlertTriangle color='#ef4444' size={18} strokeWidth={2} />
                <Text className='text-base font-bold text-red-600'>
                  Danger Zone
                </Text>
              </View>
              <Text className='mb-4 text-sm text-red-600/70'>
                Once you delete a habit, all associated data including streaks
                and history will be permanently removed.
              </Text>
              <TouchableOpacity
                accessibilityLabel='Delete habit'
                accessibilityRole='button'
                className='h-12 items-center justify-center rounded-xl bg-red-500'
                onPress={() => {
                  triggerSelection();
                  setShowDeleteConfirmation(true);
                }}
              >
                <Text className='text-base font-semibold text-white'>
                  Delete Habit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {showTimePicker && (
          <DateTimePicker
            display='spinner'
            is24Hour={false}
            mode='time'
            value={reminderTime}
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                setReminderTime(selectedTime);
              }
            }}
          />
        )}

        {/* Bottom Buttons */}
        <View className='flex-row gap-3 bg-[#faf9f7] px-4 pb-8 pt-4'>
          <TouchableOpacity
            className='h-14 flex-1 items-center justify-center rounded-2xl bg-stone-200'
            onPress={() => {
              triggerSelection();
              onClose();
            }}
          >
            <Text className='text-base font-semibold text-[#1a1a1a]'>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='h-14 flex-1 items-center justify-center rounded-2xl bg-[#1a1a1a]'
            onPress={() => {
              triggerSelection();
              handleSave();
            }}
          >
            <Text className='text-base font-semibold text-white'>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <EmojiPickerSheet
        habitName={habitName}
        selectedEmoji={selectedEmoji}
        visible={isEmojiPickerVisible}
        onClose={() => setIsEmojiPickerVisible(false)}
        onSelect={(emoji) => {
          if (emoji !== null) {
            setSelectedEmoji(emoji);
            // Color is now explicitly controlled via color picker - no random assignment
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        transparent
        animationType='fade'
        visible={showDeleteConfirmation}
        onRequestClose={() => setShowDeleteConfirmation(false)}
      >
        <View className='flex-1 items-center justify-center bg-black/50'>
          <View className='mx-6 w-full max-w-sm rounded-2xl bg-white p-6'>
            <View className='mb-4 items-center'>
              <View className='mb-3 h-14 w-14 items-center justify-center rounded-full bg-red-100'>
                <AlertTriangle color='#ef4444' size={28} strokeWidth={2} />
              </View>
              <Text className='text-lg font-bold text-stone-800'>
                Delete '{habitName || 'this habit'}'?
              </Text>
            </View>
            <Text className='mb-6 text-center text-[13px] font-normal text-stone-500'>
              This action cannot be undone. All your progress, streaks, and
              history for this habit will be permanently deleted.
            </Text>
            <View className='flex-row gap-3'>
              <TouchableOpacity
                accessibilityLabel='Cancel delete'
                accessibilityRole='button'
                className='h-12 flex-1 items-center justify-center rounded-xl bg-stone-100'
                onPress={() => {
                  triggerSelection();
                  setShowDeleteConfirmation(false);
                }}
              >
                <Text className='text-base font-semibold text-stone-700'>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel='Confirm delete'
                accessibilityRole='button'
                className='h-12 flex-1 items-center justify-center rounded-xl bg-red-500'
                onPress={() => {
                  triggerSelection();
                  setShowDeleteConfirmation(false);
                  handleDelete();
                }}
              >
                <Text className='text-base font-semibold text-white'>
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
        animationType='fade'
        visible={showArchiveConfirmation}
        onRequestClose={() => setShowArchiveConfirmation(false)}
      >
        <View className='flex-1 items-center justify-center bg-black/50'>
          <View className='mx-6 w-full max-w-sm rounded-2xl bg-white p-6'>
            <View className='mb-4 items-center'>
              <View className='mb-3 h-14 w-14 items-center justify-center rounded-full bg-amber-100'>
                <Archive color='#d97706' size={28} strokeWidth={2} />
              </View>
              <Text className='text-lg font-bold text-stone-800'>
                Archive '{habitName || 'this habit'}'?
              </Text>
            </View>
            <Text className='mb-6 text-center text-[13px] font-normal text-stone-500'>
              This habit will be hidden from your home screen but all your
              progress, streaks, and history will be preserved. You can restore
              it anytime from Settings.
            </Text>
            <View className='flex-row gap-3'>
              <TouchableOpacity
                accessibilityLabel='Cancel archive'
                accessibilityRole='button'
                className='h-12 flex-1 items-center justify-center rounded-xl bg-stone-100'
                onPress={() => {
                  triggerSelection();
                  setShowArchiveConfirmation(false);
                }}
              >
                <Text className='text-base font-semibold text-stone-700'>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel='Confirm archive'
                accessibilityRole='button'
                className='h-12 flex-1 items-center justify-center rounded-xl bg-amber-500'
                onPress={() => {
                  triggerSelection();
                  setShowArchiveConfirmation(false);
                  handleArchive();
                }}
              >
                <Text className='text-base font-semibold text-white'>
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
        animationType='slide'
        visible={showUnitPicker}
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <Pressable
          className='flex-1 justify-end bg-black/50'
          onPress={() => setShowUnitPicker(false)}
        >
          <Pressable
            className='rounded-t-3xl bg-white'
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <View className='items-center py-3'>
              <View className='h-1 w-10 rounded-full bg-stone-300' />
            </View>

            {/* Header */}
            <View className='flex-row items-center justify-between px-6 pb-4'>
              <Text className='text-lg font-bold text-stone-800'>
                Select Unit
              </Text>
              <TouchableOpacity
                accessibilityLabel='Close unit picker'
                accessibilityRole='button'
                onPress={() => {
                  triggerSelection();
                  setShowUnitPicker(false);
                }}
              >
                <Text className='text-base font-semibold text-blue-500'>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            {/* Unit Options */}
            <View className='px-4 pb-8'>
              {GOAL_UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit.value}
                  accessibilityLabel={`Select ${unit.label} as goal unit`}
                  accessibilityRole='button'
                  accessibilityState={{ selected: goalUnit === unit.value }}
                  className={`mb-2 flex-row items-center justify-between rounded-xl px-4 py-4 ${
                    goalUnit === unit.value
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : 'bg-stone-50'
                  }`}
                  onPress={() => {
                    triggerSelection();
                    setGoalUnit(unit.value);
                    setShowUnitPicker(false);
                  }}
                >
                  <View className='flex-row items-center gap-3'>
                    <Text className='text-xl'>{unit.icon}</Text>
                    <Text
                      className={`text-base font-medium ${
                        goalUnit === unit.value
                          ? 'text-blue-600'
                          : 'text-stone-800'
                      }`}
                    >
                      {unit.label}
                    </Text>
                  </View>
                  {goalUnit === unit.value && (
                    <Check color='#3B82F6' size={20} strokeWidth={3} />
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
