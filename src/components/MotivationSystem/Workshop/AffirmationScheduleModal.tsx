/**
 * AffirmationScheduleModal Component
 * Modal for setting up scheduled delivery of affirmations
 *
 * Premium feature: Allows users to receive daily or weekly push notifications
 * at scheduled times with their affirmations.
 *
 * Scientific Basis:
 * - Timed delivery optimizes habit formation (implementation intentions)
 * - Spaced repetition builds neural pathways for positive thinking
 * - Morning affirmations shown to improve daily mood and focus
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Bell,
  BellOff,
  Calendar,
  Clock,
  X,
  Check,
  Sparkles,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  formatDaysOfWeek,
  getNextAffirmationDeliveryRelativeTime,
  type AffirmationFrequency,
} from '../../../utils/notifications';

export interface AffirmationScheduleData {
  scheduledTime?: string; // "HH:MM" 24-hour format
  frequency?: AffirmationFrequency;
  daysOfWeek?: number[];
  isScheduleEnabled?: boolean;
}

export interface AffirmationScheduleModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Close the modal */
  onClose: () => void;
  /** Save schedule configuration */
  onSave: (schedule: AffirmationScheduleData) => Promise<void>;
  /** Cancel/remove existing schedule */
  onCancel: () => Promise<void>;
  /** Initial schedule data */
  initialSchedule?: AffirmationScheduleData;
  /** Affirmation text (for preview) */
  affirmationText: string;
  /** Whether save is in progress */
  isSaving?: boolean;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Parse HH:MM string to Date object (today at that time)
 */
function parseTimeToDate(time?: string): Date {
  const now = new Date();
  if (!time) {
    // Default to 8:00 AM
    now.setHours(8, 0, 0, 0);
    return now;
  }

  const [hours, minutes] = time.split(':').map(Number);
  now.setHours(hours, minutes, 0, 0);
  return now;
}

/**
 * Format Date to HH:MM string
 */
function formatDateToTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format time for display (12-hour with AM/PM)
 */
function formatTimeForDisplay(time?: string): string {
  if (!time) return '8:00 AM';
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * DaySelector Component
 * 7-day selector for weekly frequency
 */
function DaySelector({
  selectedDays,
  onToggleDay,
}: {
  selectedDays: number[];
  onToggleDay: (day: number) => void;
}) {
  return (
    <View className='flex-row justify-between gap-1'>
      {DAY_NAMES.map((name, index) => {
        const isSelected = selectedDays.includes(index);
        return (
          <Pressable
            key={index}
            accessibilityLabel={`${name}${isSelected ? ' selected' : ''}`}
            accessibilityRole='checkbox'
            accessibilityState={{ checked: isSelected }}
            className={clsx(
              'h-10 w-10 items-center justify-center rounded-full',
              isSelected ? 'bg-amber-500' : 'bg-stone-100'
            )}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onToggleDay(index);
            }}
          >
            <Text
              className={clsx(
                'text-xs font-semibold',
                isSelected ? 'text-white' : 'text-stone-600'
              )}
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * FrequencySelector Component
 * Toggle between daily and weekly
 */
function FrequencySelector({
  frequency,
  onSelect,
}: {
  frequency: AffirmationFrequency;
  onSelect: (frequency: AffirmationFrequency) => void;
}) {
  return (
    <View className='flex-row gap-2'>
      <Pressable
        accessibilityLabel='Daily delivery'
        accessibilityRole='radio'
        accessibilityState={{ selected: frequency === 'daily' }}
        className={clsx(
          'flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 py-3',
          frequency === 'daily'
            ? 'border-amber-500 bg-amber-50'
            : 'border-stone-200 bg-white'
        )}
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect('daily');
        }}
      >
        <Calendar
          className={
            frequency === 'daily' ? 'text-amber-600' : 'text-stone-400'
          }
          size={18}
        />
        <Text
          className={clsx(
            'font-medium',
            frequency === 'daily' ? 'text-amber-700' : 'text-stone-600'
          )}
        >
          Every Day
        </Text>
      </Pressable>

      <Pressable
        accessibilityLabel='Weekly delivery'
        accessibilityRole='radio'
        accessibilityState={{ selected: frequency === 'weekly' }}
        className={clsx(
          'flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 py-3',
          frequency === 'weekly'
            ? 'border-amber-500 bg-amber-50'
            : 'border-stone-200 bg-white'
        )}
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect('weekly');
        }}
      >
        <Calendar
          className={
            frequency === 'weekly' ? 'text-amber-600' : 'text-stone-400'
          }
          size={18}
        />
        <Text
          className={clsx(
            'font-medium',
            frequency === 'weekly' ? 'text-amber-700' : 'text-stone-600'
          )}
        >
          Custom Days
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * AffirmationScheduleModal - Main Component
 */
export function AffirmationScheduleModal({
  visible,
  onClose,
  onSave,
  onCancel,
  initialSchedule,
  affirmationText,
  isSaving = false,
}: AffirmationScheduleModalProps) {
  // Form state
  const [time, setTime] = useState<Date>(
    parseTimeToDate(initialSchedule?.scheduledTime)
  );
  const [frequency, setFrequency] = useState<AffirmationFrequency>(
    initialSchedule?.frequency ?? 'daily'
  );
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    initialSchedule?.daysOfWeek ?? [1, 2, 3, 4, 5] // Default: Mon-Fri
  );
  const [isEnabled, setIsEnabled] = useState<boolean>(
    initialSchedule?.isScheduleEnabled ?? true
  );

  // Time picker visibility (Android only)
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios');

  // Has existing schedule
  const hasExistingSchedule = !!initialSchedule?.scheduledTime;

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setTime(parseTimeToDate(initialSchedule?.scheduledTime));
      setFrequency(initialSchedule?.frequency ?? 'daily');
      setDaysOfWeek(initialSchedule?.daysOfWeek ?? [1, 2, 3, 4, 5]);
      setIsEnabled(initialSchedule?.isScheduleEnabled ?? true);
      setShowTimePicker(Platform.OS === 'ios');
    }
  }, [visible, initialSchedule]);

  // Toggle day selection
  const handleToggleDay = useCallback((day: number) => {
    setDaysOfWeek((prev) => {
      if (prev.includes(day)) {
        // Don't allow deselecting the last day
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== day);
      }
      return [...prev, day].sort((a, b) => a - b);
    });
  }, []);

  // Handle time change
  const handleTimeChange = useCallback((_: unknown, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  }, []);

  // Save schedule
  const handleSave = useCallback(() => {
    if (isSaving) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const scheduleData: AffirmationScheduleData = {
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      frequency,
      isScheduleEnabled: isEnabled,
      scheduledTime: formatDateToTime(time),
    };

    void onSave(scheduleData).then(() => onClose());
  }, [isSaving, frequency, daysOfWeek, isEnabled, time, onSave, onClose]);

  // Cancel schedule
  const handleCancelSchedule = useCallback(() => {
    if (isSaving) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    void onCancel().then(() => onClose());
  }, [isSaving, onCancel, onClose]);

  // Compute next delivery preview
  const timeString = formatDateToTime(time);
  const nextDelivery = isEnabled
    ? getNextAffirmationDeliveryRelativeTime(
        timeString,
        frequency,
        frequency === 'weekly' ? daysOfWeek : undefined
      )
    : null;

  // Check if can save - enabled and valid configuration
  const _canSave =
    isEnabled &&
    (frequency === 'daily' ||
      (frequency === 'weekly' && daysOfWeek.length > 0));

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-white'>
        {/* Header */}
        <View className='flex-row items-center justify-between border-b border-stone-100 px-4 pb-4 pt-6'>
          <View className='flex-row items-center gap-3'>
            <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
              <Bell className='text-amber-600' size={20} />
            </View>
            <View>
              <Text className='text-lg font-bold text-stone-800'>
                Schedule Delivery
              </Text>
              <Text className='text-xs text-stone-500'>
                Get reminders with your affirmation
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityLabel='Close'
            className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
            onPress={onClose}
          >
            <X className='text-stone-500' size={20} />
          </Pressable>
        </View>

        <ScrollView
          className='flex-1'
          contentContainerClassName='p-4 pb-8'
          keyboardShouldPersistTaps='handled'
        >
          {/* Affirmation preview */}
          <View className='mb-6 rounded-xl bg-amber-50 p-4'>
            <Text className='text-sm font-medium italic text-amber-800'>
              "{affirmationText}"
            </Text>
          </View>

          {/* Enable toggle */}
          <View className='mb-6 flex-row items-center justify-between rounded-xl bg-stone-50 p-4'>
            <View className='flex-row items-center gap-3'>
              {isEnabled ? (
                <Bell className='text-amber-500' size={20} />
              ) : (
                <BellOff className='text-stone-400' size={20} />
              )}
              <View>
                <Text className='font-medium text-stone-800'>
                  Scheduled Delivery
                </Text>
                <Text className='text-xs text-stone-500'>
                  Receive push notifications
                </Text>
              </View>
            </View>
            <Switch
              accessibilityLabel='Enable scheduled delivery'
              ios_backgroundColor='#d6d3d1'
              thumbColor='white'
              trackColor={{ false: '#d6d3d1', true: '#f59e0b' }}
              value={isEnabled}
              onValueChange={(value) => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsEnabled(value);
              }}
            />
          </View>

          {/* Schedule configuration (shown when enabled) */}
          {isEnabled && (
            <>
              {/* Time picker */}
              <View className='mb-6'>
                <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
                  Delivery Time
                </Text>
                {Platform.OS === 'android' && !showTimePicker && (
                  <Pressable
                    accessibilityLabel='Select time'
                    className='flex-row items-center justify-between rounded-xl border-2 border-amber-200 bg-white px-4 py-3'
                    onPress={() => setShowTimePicker(true)}
                  >
                    <View className='flex-row items-center gap-3'>
                      <Clock className='text-amber-500' size={20} />
                      <Text className='text-lg font-medium text-stone-800'>
                        {formatTimeForDisplay(formatDateToTime(time))}
                      </Text>
                    </View>
                    <Text className='text-sm text-amber-600'>Change</Text>
                  </Pressable>
                )}
                {showTimePicker && (
                  <View
                    className={clsx(
                      'rounded-xl bg-white',
                      Platform.OS === 'android' && 'items-center py-2'
                    )}
                  >
                    <DateTimePicker
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      mode='time'
                      testID='time-picker'
                      value={time}
                      onChange={handleTimeChange}
                    />
                  </View>
                )}
              </View>

              {/* Frequency selector */}
              <View className='mb-6'>
                <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
                  Frequency
                </Text>
                <FrequencySelector
                  frequency={frequency}
                  onSelect={setFrequency}
                />
              </View>

              {/* Day selector (for weekly) */}
              {frequency === 'weekly' && (
                <View className='mb-6'>
                  <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
                    Days of Week
                  </Text>
                  <DaySelector
                    selectedDays={daysOfWeek}
                    onToggleDay={handleToggleDay}
                  />
                  <Text className='mt-2 text-xs text-stone-500'>
                    Selected: {formatDaysOfWeek(daysOfWeek)}
                  </Text>
                </View>
              )}

              {/* Next delivery preview */}
              {nextDelivery && (
                <View className='mb-6 flex-row items-center gap-2 rounded-xl bg-emerald-50 p-3'>
                  <Sparkles className='text-emerald-500' size={16} />
                  <Text className='flex-1 text-sm text-emerald-700'>
                    Next delivery:{' '}
                    <Text className='font-medium'>{nextDelivery}</Text>
                  </Text>
                </View>
              )}

              {/* Science callout */}
              <View className='flex-row items-start gap-2 rounded-xl bg-amber-50 p-3'>
                <Sparkles className='mt-0.5 text-amber-500' size={16} />
                <Text className='flex-1 text-xs leading-relaxed text-amber-700'>
                  Morning affirmations have been shown to improve mood and focus
                  throughout the day. Consistency is key for building neural
                  pathways.
                </Text>
              </View>
            </>
          )}
        </ScrollView>

        {/* Footer */}
        <View className='border-t border-stone-100 px-4 pb-8 pt-4'>
          {/* Save button */}
          <Pressable
            accessibilityLabel={
              isEnabled ? 'Save schedule' : 'Disable scheduled delivery'
            }
            accessibilityRole='button'
            accessibilityState={{
              disabled: isSaving || (!isEnabled && !hasExistingSchedule),
            }}
            className={clsx(
              'flex-row items-center justify-center gap-2 rounded-xl py-4',
              isSaving
                ? 'bg-stone-200'
                : isEnabled
                  ? 'bg-amber-500'
                  : hasExistingSchedule
                    ? 'bg-rose-500'
                    : 'bg-stone-200'
            )}
            disabled={isSaving || (!isEnabled && !hasExistingSchedule)}
            onPress={isEnabled ? handleSave : handleCancelSchedule}
          >
            {isEnabled ? (
              <>
                <Check
                  className={isSaving ? 'text-stone-400' : 'text-white'}
                  size={20}
                />
                <Text
                  className={clsx(
                    'text-base font-semibold',
                    isSaving ? 'text-stone-400' : 'text-white'
                  )}
                >
                  {isSaving ? 'Saving...' : 'Save Schedule'}
                </Text>
              </>
            ) : hasExistingSchedule ? (
              <>
                <BellOff className='text-white' size={20} />
                <Text className='text-base font-semibold text-white'>
                  Remove Schedule
                </Text>
              </>
            ) : (
              <Text className='text-base font-semibold text-stone-400'>
                Enable to save
              </Text>
            )}
          </Pressable>

          {/* Cancel existing schedule (shown separately when enabled with existing) */}
          {hasExistingSchedule && isEnabled && (
            <Pressable
              accessibilityLabel='Remove schedule'
              className='mt-3 flex-row items-center justify-center gap-2 py-2'
              onPress={handleCancelSchedule}
            >
              <BellOff className='text-rose-500' size={16} />
              <Text className='text-sm font-medium text-rose-500'>
                Remove Schedule
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default AffirmationScheduleModal;
