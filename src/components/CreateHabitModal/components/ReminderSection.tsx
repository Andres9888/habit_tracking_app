import { Switch, Text, TouchableOpacity, View } from 'react-native';
import STRINGS from '../../../constants/strings';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { formatReminderTime } from '../../../utils/notifications';

interface ReminderSectionProps {
  remindersEnabled: boolean;
  onToggle: (value: boolean) => void;
  reminderTime: Date;
  onTimePress: () => void;
  reminderSound: string;
  onQuickTimeSelect?: (d: Date) => void;
}

export const ReminderSection = ({
  remindersEnabled,
  onToggle,
  reminderTime,
  onTimePress,
  reminderSound,
  onQuickTimeSelect,
}: ReminderSectionProps) => {
  const { triggerSelection } = useHapticFeedback();
  return (
    <View className='mb-6 rounded-2xl bg-white p-4'>
      <View className='mb-1 flex-row items-center justify-between'>
        <Text className='text-base font-semibold text-[#1a1a1a]'>
          {STRINGS.CREATE_HABIT.remindersLabel}
        </Text>
        <Switch
          ios_backgroundColor='#E5E5E5'
          thumbColor='#FFFFFF'
          trackColor={{ false: '#E5E5E5', true: '#3B82F6' }}
          value={remindersEnabled}
          onValueChange={(val) => {
            triggerSelection();
            onToggle(val);
          }}
        />
      </View>
      <Text className='mb-4 text-[13px] text-[#64748b]'>
        {STRINGS.CREATE_HABIT.remindersHelper}
      </Text>
      {remindersEnabled && (
        <>
          <TouchableOpacity
            className='mb-3 flex-row items-center justify-between rounded-xl bg-[#F5F5F5] px-3 py-3'
            onPress={() => {
              triggerSelection();
              onTimePress();
            }}
          >
            <Text className='text-base font-medium text-[#1a1a1a]'>
              {STRINGS.CREATE_HABIT.reminderTime}
            </Text>
            <Text className='text-base font-semibold text-[#3B82F6]'>
              {formatReminderTime(reminderTime)}
            </Text>
          </TouchableOpacity>
          {/* Quick reminder presets */}
          <View className='mb-3 flex-row flex-wrap gap-2'>
            {buildQuickPresets().map((p) => (
              <TouchableOpacity
                key={p.label}
                accessibilityRole='button'
                accessibilityLabel={`Set reminder to ${p.label}`}
                className='rounded-full border border-[#e5e7eb] bg-[#F9FAFB] px-3 py-2'
                onPress={() => {
                  if (onQuickTimeSelect) {
                    triggerSelection();
                    onQuickTimeSelect(p.date);
                  }
                }}
              >
                <Text className='text-[13px] font-medium text-[#334155]'>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className='flex-row items-center justify-between rounded-xl bg-[#F5F5F5] px-3 py-3'>
            <Text className='text-base font-medium text-[#1a1a1a]'>
              {STRINGS.CREATE_HABIT.sound}
            </Text>
            <Text className='text-base font-semibold text-[#3B82F6]'>
              {reminderSound}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const buildQuickPresets = () => {
  const now = new Date();
  const presets = [
    { label: 'Morning 8:00', hour: 8, minute: 0, alwaysTomorrow: false },
    { label: 'Afternoon 1:00', hour: 13, minute: 0, alwaysTomorrow: false },
    { label: 'Evening 8:30', hour: 20, minute: 30, alwaysTomorrow: false },
    { label: 'Tomorrow 9:00', hour: 9, minute: 0, alwaysTomorrow: true },
  ];
  return presets.map((p) => ({ label: p.label, date: nextAt(now, p.hour, p.minute, p.alwaysTomorrow) }));
};

const nextAt = (base: Date, hour: number, minute: number, alwaysTomorrow: boolean) => {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  if (alwaysTomorrow || d.getTime() <= base.getTime()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
};
