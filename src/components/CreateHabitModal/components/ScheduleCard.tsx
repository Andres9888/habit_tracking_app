import { memo } from 'react';
import { Text, View } from 'react-native';
import { Calendar, CheckCircle, Circle } from 'lucide-react-native';
import { CompletionBadge } from './CompletionBadge';
import { TimeOfDaySelector, type TimeOfDay } from './TimeOfDaySelector';
import { ReminderSelector } from './ReminderSelector';
import { FrequencyPresets } from './FrequencyPresets';
import { FrequencySelector } from './FrequencySelector';

/**
 * Props for ScheduleCard component
 */
interface ScheduleCardProps {
  /** Selected time of day */
  timeOfDay: TimeOfDay;
  /** Whether reminder is enabled */
  reminderEnabled: boolean;
  /** Reminder time string (e.g., "12:00 PM") */
  reminderTime: string;
  /** Selected days array [Sun, Mon, Tue, Wed, Thu, Fri, Sat] */
  selectedDays: boolean[];
  /** Callback when time of day changes */
  onTimeOfDayChange: (value: TimeOfDay) => void;
  /** Callback when reminder toggle changes */
  onReminderToggle: (enabled: boolean) => void;
  /** Callback when reminder time is pressed */
  onReminderTimePress: () => void;
  /** Callback when frequency changes */
  onFrequencyChange: (days: boolean[]) => void;
  /** Whether this section is complete (at least one day selected) */
  isComplete: boolean;
}

/**
 * Card wrapper for Schedule section (time + reminder + frequency)
 *
 * Features:
 * - Card header with Calendar icon, "SCHEDULE" title, and completion state
 * - Required badge
 * - Checkmark when complete (at least one day selected)
 * - Integrates TimeOfDaySelector (Morning/Afternoon/Evening)
 * - Integrates ReminderSelector (toggle + time)
 * - Integrates FrequencyPresets (Daily/Weekdays/Weekends quick buttons)
 * - Integrates FrequencySelector (individual day selection)
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleCard
 *   timeOfDay="afternoon"
 *   reminderEnabled={true}
 *   reminderTime="12:00 PM"
 *   selectedDays={[true, true, true, true, true, true, true]}
 *   onTimeOfDayChange={setTimeOfDay}
 *   onReminderToggle={setReminderEnabled}
 *   onReminderTimePress={openTimePicker}
 *   onFrequencyChange={setSelectedDays}
 *   isComplete={selectedDays.some(day => day)}
 * />
 * ```
 */
const ScheduleCardComponent = ({
  timeOfDay,
  reminderEnabled,
  reminderTime,
  selectedDays,
  onTimeOfDayChange,
  onReminderToggle,
  onReminderTimePress,
  onFrequencyChange,
  isComplete,
}: ScheduleCardProps) => {
  return (
    <View
      className="mb-5 rounded-2xl bg-white p-4 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Card Header */}
      <View className="mb-4 flex-row items-center justify-between">
        {/* Left side: Icon + Title */}
        <View className="flex-row items-center gap-2">
          <Calendar color="#10B981" size={18} strokeWidth={2} />
          <Text className="text-sm font-bold uppercase tracking-wide text-stone-900">
            Schedule
          </Text>
        </View>

        {/* Right side: Badge + Completion State */}
        <View className="flex-row items-center gap-2">
          <CompletionBadge type="required" />
          {isComplete ? (
            <CheckCircle
              accessibilityLabel="Section complete"
              color="#10B981"
              size={20}
              strokeWidth={2}
            />
          ) : (
            <Circle
              accessibilityLabel="Section incomplete"
              color="#D6D3D1"
              size={20}
              strokeWidth={2}
            />
          )}
        </View>
      </View>

      {/* Content: Time of Day */}
      <View className="mb-4">
        <TimeOfDaySelector value={timeOfDay} onChange={onTimeOfDayChange} />
      </View>

      {/* Content: Reminder */}
      <View className="mb-4">
        <ReminderSelector
          enabled={reminderEnabled}
          time={reminderTime}
          onTimePress={onReminderTimePress}
          onToggle={onReminderToggle}
        />
      </View>

      {/* Content: Frequency Presets + Selector */}
      <View>
        <FrequencyPresets
          selectedDays={selectedDays}
          onPresetSelect={onFrequencyChange}
        />
        <FrequencySelector
          selectedDays={selectedDays}
          onChange={onFrequencyChange}
        />
      </View>
    </View>
  );
};

/**
 * Memoized ScheduleCard component for performance optimization
 */
export const ScheduleCard = memo(ScheduleCardComponent);
