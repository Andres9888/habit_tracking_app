/**
 * ScheduleCard Component - Cards V1 Improved Spec
 * Task 6: Create ScheduleCard Component
 *
 * Features:
 * - Card wrapper for schedule-related settings (time, reminder, frequency)
 * - Header displays calendar icon, title, required badge, and completion checkmark
 * - Integrates TimeOfDaySelector, ReminderSelector, and FrequencyPresets
 * - Completion checkmark appears when at least one day is selected
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, CheckCircle, Circle } from 'lucide-react-native';
import { CompletionBadge } from './CompletionBadge';
import { TimeOfDaySelector } from './TimeOfDaySelector';
import { ReminderSelector, type ReminderOption } from './ReminderSelector';
import { FrequencyPresets } from './FrequencyPresets';
import type { HubermanPhase } from '../../../constants/hubermanPhases';

/**
 * Placeholder FrequencySelector component until it's implemented
 * This should be replaced with the actual FrequencySelector component
 */
const FrequencySelectorPlaceholder = memo<{
  selectedDays: boolean[];
  onChange: (days: boolean[]) => void;
}>(({ selectedDays, onChange }) => {
  const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.frequencySelector}>
      <View style={styles.dayButtonsRow}>
        {DAYS.map((day, index) => {
          const isSelected = selectedDays[index];
          return (
            <View
              key={index}
              style={[
                styles.dayButton,
                isSelected
                  ? styles.dayButtonSelected
                  : styles.dayButtonUnselected,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${DAY_LABELS[index]}${
                isSelected ? ', selected' : ''
              }`}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  isSelected
                    ? styles.dayButtonTextSelected
                    : styles.dayButtonTextUnselected,
                ]}
                onPress={() => {
                  const newDays = [...selectedDays];
                  newDays[index] = !newDays[index];
                  onChange(newDays);
                }}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});

FrequencySelectorPlaceholder.displayName = 'FrequencySelectorPlaceholder';

/**
 * Props for ScheduleCard component
 */
export interface ScheduleCardProps {
  /**
   * Currently selected time of day (Huberman phase)
   */
  timeOfDay: HubermanPhase | null;
  /**
   * Currently selected reminder option
   */
  reminderOption: ReminderOption;
  /**
   * Currently selected days (7-element boolean array)
   * Array index: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
   */
  selectedDays: boolean[];
  /**
   * Callback when time of day changes
   */
  onTimeOfDayChange: (phase: HubermanPhase) => void;
  /**
   * Callback when reminder option changes
   */
  onReminderOptionChange: (option: ReminderOption) => void;
  /**
   * Callback when frequency (selected days) changes
   */
  onFrequencyChange: (days: boolean[]) => void;
  /**
   * Whether the card section is complete
   * True if at least one day is selected
   */
  isComplete: boolean;
}

/**
 * ScheduleCard displays schedule-related settings within a card wrapper
 * with completion tracking and visual feedback
 *
 * Design specs:
 * - Card wrapper matches other card styling
 * - Header with Calendar icon, "SCHEDULE" title, required badge, and completion state
 * - Integrates TimeOfDaySelector, ReminderSelector, and FrequencyPresets
 * - Completion checkmark appears when at least one day selected
 * - All components properly spaced with mb-4
 *
 * @param props - ScheduleCard component props
 * @returns JSX.Element
 */
export const ScheduleCard = memo<ScheduleCardProps>(
  ({
    timeOfDay,
    reminderOption,
    selectedDays,
    onTimeOfDayChange,
    onReminderOptionChange,
    onFrequencyChange,
    isComplete,
  }) => {
    return (
      <View
        style={styles.card}
        accessibilityRole="group"
        accessibilityLabel="Schedule section"
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          {/* Left side: Icon and title */}
          <View style={styles.headerLeft}>
            <Calendar size={18} color="#10B981" strokeWidth={2} />
            <Text style={styles.cardTitle}>Schedule</Text>
          </View>

          {/* Right side: Badge and completion state */}
          <View style={styles.headerRight}>
            <CompletionBadge type="required" />
            {isComplete ? (
              <CheckCircle
                size={20}
                color="#10B981"
                fill="#10B981"
                strokeWidth={2}
                accessibilityLabel="Section complete"
              />
            ) : (
              <Circle
                size={20}
                color="#D6D3D1"
                strokeWidth={2}
                accessibilityLabel="Section incomplete"
              />
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Time of Day Selector */}
          <View style={styles.section}>
            <TimeOfDaySelector
              selectedPhase={timeOfDay}
              onSelectPhase={onTimeOfDayChange}
            />
          </View>

          {/* Reminder Selector */}
          <View style={styles.section}>
            <ReminderSelector
              selectedOption={reminderOption}
              onSelectOption={onReminderOptionChange}
            />
          </View>

          {/* Frequency Section with Presets */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Frequency</Text>
            <FrequencyPresets
              selectedDays={selectedDays}
              onPresetSelect={onFrequencyChange}
            />
            <FrequencySelectorPlaceholder
              selectedDays={selectedDays}
              onChange={onFrequencyChange}
            />
          </View>
        </View>
      </View>
    );
  }
);

ScheduleCard.displayName = 'ScheduleCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-4
    marginBottom: 20, // mb-5
    // Shadow configuration for iOS and Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // mb-4
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#1C1917', // stone-900
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    // Content area styles
  },
  section: {
    marginBottom: 16, // mb-4
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#78716C', // stone-500
    marginBottom: 12, // mb-3
  },
  // Placeholder FrequencySelector styles
  frequencySelector: {
    marginTop: 12,
  },
  dayButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayButtonSelected: {
    backgroundColor: '#10B981', // emerald-500
    borderColor: '#10B981',
  },
  dayButtonUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E5E4', // stone-200
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  dayButtonTextUnselected: {
    color: '#78716C', // stone-500
  },
});
