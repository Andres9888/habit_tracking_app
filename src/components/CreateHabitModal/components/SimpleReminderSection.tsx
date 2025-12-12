import { useCallback, useRef } from 'react';
import { Animated, Pressable, Switch, Text, View } from 'react-native';
import { Bell, ChevronRight } from 'lucide-react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { formatReminderTime } from '../../../utils/notifications';

interface SimpleReminderSectionProps {
  onQuickTimeSelect: (date: Date) => void;
  onTimePress: () => void;
  onToggle: (value: boolean) => void;
  reminderTime: Date;
  remindersEnabled: boolean;
}

interface QuickTimeButtonProps {
  isSelected: boolean;
  label: string;
  onPress: () => void;
  time: string;
}

const QuickTimeButton = ({ isSelected, label, onPress, time }: QuickTimeButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Set reminder to ${label} at ${time}`}
        accessibilityRole="button"
        className={`items-center rounded-xl py-3 ${
          isSelected ? 'bg-blue-500' : 'bg-slate-100'
        }`}
        onPress={() => {
          triggerSelection();
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text
          className={`text-xs font-semibold ${
            isSelected ? 'text-white' : 'text-slate-600'
          }`}
        >
          {label}
        </Text>
        <Text
          className={`mt-0.5 text-[10px] ${
            isSelected ? 'text-blue-100' : 'text-slate-400'
          }`}
        >
          {time}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const buildQuickPresets = () => {
  const now = new Date();
  return [
    { alwaysTomorrow: false, hour: 8, label: 'Morning', minute: 0 },
    { alwaysTomorrow: false, hour: 13, label: 'Afternoon', minute: 0 },
    { alwaysTomorrow: false, hour: 20, label: 'Evening', minute: 30 },
  ].map((p) => ({
    date: nextAt(now, p.hour, p.minute, p.alwaysTomorrow),
    label: p.label,
    time: `${p.hour > 12 ? p.hour - 12 : p.hour}:${p.minute.toString().padStart(2, '0')} ${p.hour >= 12 ? 'PM' : 'AM'}`,
  }));
};

const nextAt = (base: Date, hour: number, minute: number, alwaysTomorrow: boolean) => {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  if (alwaysTomorrow || d.getTime() <= base.getTime()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
};

const isTimeMatch = (date1: Date, hour: number, minute: number) => {
  return date1.getHours() === hour && date1.getMinutes() === minute;
};

export const SimpleReminderSection = ({
  onQuickTimeSelect,
  onTimePress,
  onToggle,
  reminderTime,
  remindersEnabled,
}: SimpleReminderSectionProps) => {
  const { triggerSelection } = useHapticFeedback();
  const presets = buildQuickPresets();

  return (
    <View className="mb-6 rounded-2xl bg-white p-4">
      {/* Header with toggle */}
      <Pressable
        accessibilityLabel={remindersEnabled ? 'Disable reminders' : 'Enable reminders'}
        accessibilityRole="switch"
        className="flex-row items-center justify-between"
        onPress={() => {
          triggerSelection();
          onToggle(!remindersEnabled);
        }}
      >
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Bell color="#3b82f6" size={20} />
          </View>
          <View>
            <Text className="text-base font-semibold text-slate-800">Remind me</Text>
            <Text className="text-xs text-slate-500">
              {remindersEnabled ? formatReminderTime(reminderTime) : 'Off'}
            </Text>
          </View>
        </View>
        <Switch
          ios_backgroundColor="#e2e8f0"
          thumbColor="#ffffff"
          trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
          value={remindersEnabled}
          onValueChange={(val) => {
            triggerSelection();
            onToggle(val);
          }}
        />
      </Pressable>

      {/* Quick time buttons */}
      {remindersEnabled && (
        <View className="mt-4">
          <View className="mb-3 flex-row gap-2">
            {presets.map((preset) => (
              <QuickTimeButton
                key={preset.label}
                isSelected={isTimeMatch(
                  reminderTime,
                  preset.date.getHours(),
                  preset.date.getMinutes()
                )}
                label={preset.label}
                time={preset.time}
                onPress={() => onQuickTimeSelect(preset.date)}
              />
            ))}
          </View>

          {/* Custom time button */}
          <Pressable
            accessibilityLabel="Choose custom reminder time"
            className="flex-row items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            onPress={() => {
              triggerSelection();
              onTimePress();
            }}
          >
            <Text className="text-sm font-medium text-slate-700">Custom time</Text>
            <View className="flex-row items-center">
              <Text className="mr-2 text-sm font-semibold text-blue-500">
                {formatReminderTime(reminderTime)}
              </Text>
              <ChevronRight color="#94a3b8" size={16} />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default SimpleReminderSection;
