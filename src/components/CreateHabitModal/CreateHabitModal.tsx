import { useState } from 'react';
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
import { X } from 'lucide-react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ensureNotificationPermissions,
  formatReminderTime,
  getDefaultReminderTime,
  scheduleHabitReminder,
} from '../../utils/notifications';

interface CreateHabitModalProps {
  visible: boolean;
  onClose: () => void;
}

const EMOJIS = ['💪', '🧘', '📖', '💧', '🎨', '🏃'];

const COLORS = [
  '#DBEAFE', // blue-100
  '#FFEDD5', // orange-100
  '#DCFCE7', // green-100
  '#F3E8FF', // purple-100
  '#FCE7F3', // pink-100
  '#CCFBF1', // teal-100
];

export default function CreateHabitModal({
  visible,
  onClose,
}: CreateHabitModalProps) {
  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>('💪');
  const [selectedColor, setSelectedColor] = useState('#DBEAFE');
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(() => getDefaultReminderTime());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderSound, setReminderSound] = useState('Default');

  const createHabit = useMutation(api.habits.create);

  const handleCreate = async () => {
    if (!habitName.trim()) return;

    const fullName = selectedEmoji
      ? `${selectedEmoji} ${habitName.trim()}`
      : habitName.trim();
    const reminderTimeString = formatReminderTime(reminderTime);

    let enableReminders = remindersEnabled;
    if (remindersEnabled) {
      const hasPermission = await ensureNotificationPermissions();
      enableReminders = hasPermission;

      if (!hasPermission) {
        Alert.alert(
          'Notifications Disabled',
          'Enable notifications in your device settings to receive habit reminders.'
        );
      }
    }

    const habitId = await createHabit({
      name: fullName,
      notes: '',
      remindersEnabled: enableReminders,
      reminderTime: enableReminders ? reminderTimeString : undefined,
      reminderSound: enableReminders ? reminderSound : undefined,
    });

    if (enableReminders && habitId) {
      await scheduleHabitReminder({
        habitId,
        title: fullName,
        body: 'Time to check in on your habit progress!',
        reminderTime,
        skipPermissionCheck: true,
      });
    }

    // Reset and close
    setHabitName('');
    setSelectedEmoji('💪');
    setSelectedColor('#DBEAFE');
    setRemindersEnabled(false);
    setReminderTime(getDefaultReminderTime());
    setReminderSound('Default');
    onClose();
  };

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50'>
        <View className='mt-12 flex-1 overflow-hidden rounded-t-3xl bg-[#f5f5f0] shadow-2xl'>
          {/* Header */}
          <View className='flex-row items-center justify-between px-4 pb-4 pt-4'>
            <TouchableOpacity
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full'
              onPress={onClose}
            >
              <X color='#1a1a1a' size={24} strokeWidth={2} />
            </TouchableOpacity>
            <Text className='text-[20px] font-bold text-[#1a1a1a]'>
              Create Habit
            </Text>
            <TouchableOpacity
              accessibilityRole='button'
              className={`h-9 items-center justify-center rounded-full px-6 ${
                habitName.trim().length > 0 ? 'bg-[#1a1a1a]' : 'bg-gray-300'
              }`}
              disabled={habitName.trim().length === 0}
              onPress={handleCreate}
            >
              <Text className='text-sm font-semibold text-white'>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
            {/* Preview Card */}
            <View className='mb-6 mt-4 rounded-2xl bg-white p-4'>
              <View className='flex-row items-center gap-4'>
                {selectedEmoji ? (
                  <View
                    className='h-16 w-16 items-center justify-center rounded-2xl'
                    style={{ backgroundColor: selectedColor }}
                  >
                    <Text className='text-[30px]'>{selectedEmoji}</Text>
                  </View>
                ) : (
                  <View className='h-16 w-16 items-center justify-center rounded-2xl bg-gray-200'>
                    <Text className='text-xs font-medium text-gray-400'>
                      No{'\n'}icon
                    </Text>
                  </View>
                )}
                <View className='flex-1'>
                  <Text className='text-[20px] font-semibold text-[#1a1a1a]'>
                    {habitName || 'Exercise'}
                  </Text>
                  <Text className='text-sm font-medium text-[#8a8a8a]'>
                    Daily
                  </Text>
                </View>
              </View>
            </View>

            {/* Habit Name Input */}
            <View className='mb-6'>
              <Text className='mb-2 text-base font-semibold text-[#1a1a1a]'>
                Habit Name
              </Text>
              <TextInput
                className='h-14 rounded-xl bg-white px-4 text-base text-[#1a1a1a]'
                placeholder='Exercise'
                placeholderTextColor='#adaebc'
                value={habitName}
                onChangeText={setHabitName}
              />
            </View>

            {/* Icon Picker */}
            <View className='mb-6'>
              <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
                Icon
              </Text>
              <View className='flex-row flex-wrap gap-3'>
                {/* No Icon Option */}
                <TouchableOpacity
                  accessibilityLabel='No icon'
                  accessibilityRole='button'
                  className='h-12 items-center justify-center rounded-xl bg-white px-3'
                  style={{
                    borderColor: '#1a1a1a',
                    borderWidth: selectedEmoji === null ? 2 : 0,
                  }}
                  onPress={() => setSelectedEmoji(null)}
                >
                  <Text className='text-xs font-medium text-[#8a8a8a]'>
                    None
                  </Text>
                </TouchableOpacity>

                {/* Emoji Options */}
                {EMOJIS.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    accessibilityLabel={`Select ${emoji} icon`}
                    accessibilityRole='button'
                    className='h-12 w-12 items-center justify-center rounded-xl bg-white'
                    style={{
                      borderColor: '#1a1a1a',
                      borderWidth: selectedEmoji === emoji ? 2 : 0,
                    }}
                    onPress={() => setSelectedEmoji(emoji)}
                  >
                    <Text className='text-2xl'>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color Picker */}
            <View className='mb-6'>
              <Text className='mb-3 text-base font-semibold text-[#1a1a1a]'>
                Color
              </Text>
              <View className='flex-row gap-3'>
                {COLORS.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    className='h-10 w-10 rounded-full'
                    style={{ backgroundColor: color }}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            {/* Reminders Section */}
            <View className='mb-6 rounded-2xl bg-white p-4'>
              {/* Reminders Toggle */}
              <View className='mb-4 flex-row items-center justify-between'>
                <Text className='text-base font-semibold text-[#1a1a1a]'>
                  Reminders
                </Text>
                <Switch
                  value={remindersEnabled}
                  onValueChange={setRemindersEnabled}
                  trackColor={{ false: '#E5E5E5', true: '#3B82F6' }}
                  thumbColor='#FFFFFF'
                  ios_backgroundColor='#E5E5E5'
                />
              </View>

              {/* Reminder Settings (shown when enabled) */}
              {remindersEnabled && (
                <>
                  {/* Reminder Time */}
                  <TouchableOpacity
                    className='mb-3 flex-row items-center justify-between rounded-xl bg-[#F5F5F5] px-3 py-3'
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text className='text-base font-medium text-[#1a1a1a]'>
                      Reminder Time
                    </Text>
                    <Text className='text-base font-semibold text-[#3B82F6]'>
                      {formatReminderTime(reminderTime)}
                    </Text>
                  </TouchableOpacity>

                  {/* Sound */}
                  <View className='flex-row items-center justify-between rounded-xl bg-[#F5F5F5] px-3 py-3'>
                    <Text className='text-base font-medium text-[#1a1a1a]'>
                      Sound
                    </Text>
                    <Text className='text-base font-semibold text-[#3B82F6]'>
                      {reminderSound}
                    </Text>
                  </View>
                </>
              )}
            </View>

          </ScrollView>

          {/* Time Picker Modal */}
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
        </View>
      </View>
    </Modal>
  );
}
