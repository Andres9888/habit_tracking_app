import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Keyboard,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';
import { Bell, Clock, ChevronRight } from 'lucide-react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { formatReminderTime } from '../../../utils/notifications';
import { TimePickerModal } from './TimePickerModal';
import { NextReminderBadge } from './NextReminderBadge';

/**
 * Reminder preset configuration
 */
export interface ReminderPreset {
  id: string;
  label: string;
  emoji: string;
  hour: number;
  minute: number;
}

/**
 * Default reminder presets matching Huberman phases
 */
export const DEFAULT_PRESETS: ReminderPreset[] = [
  { emoji: '🌅', hour: 7, id: 'morning', label: '7 AM', minute: 0 },
  { emoji: '☀️', hour: 12, id: 'midday', label: '12 PM', minute: 0 },
  { emoji: '🌙', hour: 20, id: 'evening', label: '8 PM', minute: 0 },
];

/**
 * Props for the EnhancedReminderSelector component
 */
export interface EnhancedReminderSelectorProps {
  /** Whether reminders are enabled */
  enabled: boolean;
  /** Current reminder time as Date object */
  reminderTime: Date;
  /** Called when toggle is switched */
  onToggle: (enabled: boolean) => void;
  /** Called when time changes (preset or custom) */
  onTimeChange: (time: Date) => void;
  /** Optional custom presets (defaults to morning/midday/evening) */
  presets?: ReminderPreset[];
  /** Whether to show the next reminder badge (default: true) */
  showNextReminder?: boolean;
}

/**
 * Props for individual preset buttons
 */
interface PresetButtonProps {
  preset: ReminderPreset;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion: boolean;
}

/**
 * Individual preset button with animation
 */
const PresetButtonComponent = ({
  preset,
  isSelected,
  onPress,
  reduceMotion,
}: PresetButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    if (reduceMotion) return;
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, reduceMotion]);

  const handlePressOut = useCallback(() => {
    if (reduceMotion) {
      scaleAnim.setValue(1);
      return;
    }
    Animated.spring(scaleAnim, {
      friction: 15,
      tension: 150,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, reduceMotion]);

  return (
    <Pressable
      accessibilityLabel={`Set reminder for ${preset.label}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-1'
      testID={`preset-${preset.id}`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='items-center justify-center rounded-xl px-2 py-2.5'
        style={[
          {
            backgroundColor: isSelected ? '#ECFDF5' : '#f5f5f4', // emerald-50 / stone-100
            borderColor: isSelected ? '#10B981' : 'transparent', // emerald-500
            borderWidth: isSelected ? 2 : 1,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text className='mb-0.5 text-base'>{preset.emoji}</Text>
        <Text
          className='text-xs font-medium'
          style={{ color: isSelected ? '#059669' : '#57534e' }} // emerald-600 / stone-600
        >
          {preset.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const PresetButton = memo(PresetButtonComponent);

/**
 * EnhancedReminderSelector - Full-featured reminder configuration UI.
 *
 * Features:
 * - Toggle row with bell icon and switch
 * - Quick preset buttons (Morning/Midday/Evening)
 * - Custom time button that opens native TimePickerModal
 * - Selected preset shows green border
 * - Custom time shows green border when set
 * - Next reminder badge updates on time change
 * - Keyboard dismissed on any interaction
 * - All elements have accessibility labels
 * - Haptic feedback on selection
 *
 * Usage:
 * ```tsx
 * <EnhancedReminderSelector
 *   enabled={reminderEnabled}
 *   reminderTime={reminderTime}
 *   onToggle={setReminderEnabled}
 *   onTimeChange={setReminderTime}
 * />
 * ```
 */
const EnhancedReminderSelectorComponent = ({
  enabled,
  reminderTime,
  onToggle,
  onTimeChange,
  presets = DEFAULT_PRESETS,
  showNextReminder = true,
}: EnhancedReminderSelectorProps) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { triggerSelection } = useHapticFeedback();
  const reduceMotion = useReduceMotion();

  // Determine which preset is selected (if any)
  const selectedPreset = useMemo(() => {
    const hour = reminderTime.getHours();
    const minute = reminderTime.getMinutes();
    return (
      presets.find((p) => p.hour === hour && p.minute === minute)?.id || null
    );
  }, [reminderTime, presets]);

  // Check if current time is a custom time (not matching any preset)
  const isCustomTime = selectedPreset === null;

  // Format custom time for display
  const customTimeLabel = useMemo(() => {
    if (!isCustomTime) return 'Custom time...';
    return formatReminderTime(reminderTime);
  }, [isCustomTime, reminderTime]);

  // Handle preset selection
  const handlePresetSelect = useCallback(
    (preset: ReminderPreset) => {
      Keyboard.dismiss();
      triggerSelection();
      const newTime = new Date();
      newTime.setHours(preset.hour, preset.minute, 0, 0);
      onTimeChange(newTime);

      // Announce for screen readers
      AccessibilityInfo.announceForAccessibility(
        `Reminder set for ${preset.label}`
      );
    },
    [onTimeChange, triggerSelection]
  );

  // Handle custom time button press
  const handleCustomTimePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    setShowTimePicker(true);
  }, [triggerSelection]);

  // Handle custom time confirmation from picker
  const handleCustomTimeConfirm = useCallback(
    (time: Date) => {
      triggerSelection();
      onTimeChange(time);
      setShowTimePicker(false);

      // Announce for screen readers
      const formattedTime = formatReminderTime(time);
      AccessibilityInfo.announceForAccessibility(
        `Custom reminder set for ${formattedTime}`
      );
    },
    [onTimeChange, triggerSelection]
  );

  // Handle toggle change
  const handleToggle = useCallback(
    (value: boolean) => {
      Keyboard.dismiss();
      triggerSelection();
      onToggle(value);

      // Announce for screen readers
      AccessibilityInfo.announceForAccessibility(
        value ? 'Reminders enabled' : 'Reminders disabled'
      );
    },
    [onToggle, triggerSelection]
  );

  return (
    <View className='mb-4' testID='enhanced-reminder-selector'>
      {/* Toggle Row */}
      <View
        className='flex-row items-center justify-between rounded-xl border border-stone-200 bg-white px-3.5 py-3'
        style={{
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }}
      >
        {/* Bell Icon + Label */}
        <View className='flex-row items-center gap-3'>
          <View className='h-9 w-9 items-center justify-center rounded-full bg-amber-100'>
            <Bell color='#f59e0b' size={16} />
          </View>
          <Text className='text-sm font-medium text-stone-900'>
            Daily Reminder
          </Text>
        </View>

        {/* Toggle Switch */}
        <Switch
          accessibilityLabel={enabled ? 'Disable reminder' : 'Enable reminder'}
          accessibilityRole='switch'
          ios_backgroundColor='#d6d3d1'
          testID='reminder-toggle'
          thumbColor='#ffffff'
          trackColor={{ false: '#d6d3d1', true: '#10B981' }}
          value={enabled}
          onValueChange={handleToggle}
        />
      </View>

      {/* Time Selection UI (shown when enabled) */}
      {enabled && (
        <View className='mt-3'>
          {/* Preset Buttons Row */}
          <View className='mb-3 flex-row gap-2' testID='preset-buttons'>
            {presets.map((preset) => (
              <PresetButton
                key={preset.id}
                isSelected={selectedPreset === preset.id}
                preset={preset}
                reduceMotion={reduceMotion}
                onPress={() => handlePresetSelect(preset)}
              />
            ))}
          </View>

          {/* Custom Time Button */}
          <Pressable
            accessibilityHint='Opens time picker'
            accessibilityLabel={
              isCustomTime
                ? `Custom time set to ${customTimeLabel}. Double tap to change.`
                : 'Set a custom reminder time'
            }
            accessibilityRole='button'
            className='mb-3'
            testID='custom-time-button'
            onPress={handleCustomTimePress}
          >
            <View
              className='flex-row items-center justify-between rounded-xl border px-3.5 py-3'
              style={{
                backgroundColor: isCustomTime ? '#ECFDF5' : '#ffffff', // emerald-50 / white
                borderColor: isCustomTime ? '#10B981' : '#e7e5e4', // emerald-500 / stone-200
                borderWidth: isCustomTime ? 2 : 1,
              }}
            >
              <View className='flex-row items-center gap-2.5'>
                <Clock
                  color={isCustomTime ? '#047857' : '#78716c'} // emerald-700 / stone-500
                  size={16}
                />
                <Text
                  className='text-sm font-medium'
                  style={{
                    color: isCustomTime ? '#047857' : '#1c1917', // emerald-700 / stone-900
                  }}
                >
                  {customTimeLabel}
                </Text>
              </View>
              <ChevronRight
                color={isCustomTime ? '#047857' : '#a8a29e'} // emerald-700 / stone-400
                size={18}
              />
            </View>
          </Pressable>

          {/* Next Reminder Badge */}
          {showNextReminder && (
            <View className='items-center'>
              <NextReminderBadge
                enabled={enabled}
                reminderTime={reminderTime}
              />
            </View>
          )}
        </View>
      )}

      {/* Time Picker Modal */}
      <TimePickerModal
        initialTime={reminderTime}
        visible={showTimePicker}
        onCancel={() => setShowTimePicker(false)}
        onConfirm={handleCustomTimeConfirm}
      />
    </View>
  );
};

export const EnhancedReminderSelector = memo(EnhancedReminderSelectorComponent);

export default EnhancedReminderSelector;
