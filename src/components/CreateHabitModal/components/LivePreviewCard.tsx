/**
 * LivePreviewCard Component - Cards V1 Improved Spec
 * Task 9: Update LivePreviewCard Component
 *
 * Features:
 * - Enhanced preview card with gradient background and border
 * - "Preview" label with "Live" badge indicator
 * - Badge row showing frequency, time of day, and reminder time
 * - Real-time updates as user configures their habit
 * - Increased spacing (mt-5 mb-5)
 */

import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { HubermanPhase } from '../../../constants/hubermanPhases';
import { HUBERMAN_PHASES } from '../../../constants/hubermanPhases';
import { PRESETS, type PresetType } from './FrequencyPresets';

/**
 * Props for LivePreviewCard component
 */
export interface LivePreviewCardProps {
  /** Habit name to display */
  habitName: string;
  /** Selected emoji icon */
  emoji: string | null;
  /** Selected color for the habit */
  color: string;
  /** Time of day/Huberman phase for the habit */
  timeOfDay: HubermanPhase | null;
  /** Array of selected days (7-element boolean array: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]) */
  selectedDays: boolean[];
  /** Whether reminder is enabled */
  reminderEnabled: boolean;
  /** Reminder time string (e.g., "12:00 PM") */
  reminderTime: string;
}

/**
 * Determines the frequency text based on selected days
 * Returns "Daily", "Weekdays", "Weekends", or custom pattern
 */
const getFrequencyText = (selectedDays: boolean[]): string => {
  // Check if matches a preset
  const presetEntries = Object.entries(PRESETS) as [PresetType, boolean[]][];
  const match = presetEntries.find(
    ([_, days]) => JSON.stringify(days) === JSON.stringify(selectedDays)
  );

  if (match) {
    const [presetType] = match;
    switch (presetType) {
      case 'daily':
        return 'Daily';
      case 'weekdays':
        return 'Weekdays';
      case 'weekends':
        return 'Weekends';
    }
  }

  // Custom pattern - count selected days
  const count = selectedDays.filter(Boolean).length;
  if (count === 0) return 'No days';
  if (count === 7) return 'Daily';
  return `${count} days/week`;
};

/**
 * LivePreviewCard Component
 *
 * Displays a live preview of the habit being created with enhanced visual feedback.
 * Shows the habit's emoji, name, color, frequency, time of day, and reminder settings
 * in a card format with gradient background and "Live" indicator.
 */
export const LivePreviewCard = memo<LivePreviewCardProps>(({
  habitName,
  emoji,
  color,
  timeOfDay,
  selectedDays,
  reminderEnabled,
  reminderTime,
}) => {
  // Generate frequency text from selectedDays
  const frequencyText = useMemo(() => getFrequencyText(selectedDays), [selectedDays]);

  // Get time of day info from HubermanPhase
  const timeOfDayInfo = useMemo(() => {
    if (!timeOfDay) return null;
    return HUBERMAN_PHASES[timeOfDay];
  }, [timeOfDay]);

  // Default values for empty state
  const displayEmoji = emoji || '🎯';
  const displayName = habitName.trim() || 'Your new habit';
  const displayColor = color || '#10B981'; // emerald-500

  // Accessibility label
  const accessibilityLabel = useMemo(() => {
    const parts = ['Live preview:', displayName];
    if (emoji) parts.push(`with icon ${emoji}`);
    parts.push(`Frequency: ${frequencyText}`);
    if (timeOfDayInfo) parts.push(`Time: ${timeOfDayInfo.shortLabel}`);
    if (reminderEnabled) parts.push(`Reminder at ${reminderTime}`);
    return parts.join(', ');
  }, [displayName, emoji, frequencyText, timeOfDayInfo, reminderEnabled, reminderTime]);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F9FAFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      angle={135}
      useAngle
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="summary"
      style={styles.container}
    >
      {/* Preview Label + Live Badge */}
      <View style={styles.header}>
        <Text style={styles.previewLabel}>PREVIEW</Text>
        <View style={styles.liveBadge}>
          <Sparkles size={12} color="#F59E0B" />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Habit Preview Content */}
      <View style={styles.content}>
        {/* Emoji Icon with Color Background */}
        <View
          style={[styles.emojiContainer, { backgroundColor: displayColor }]}
          accessible={false}
        >
          <Text style={styles.emoji}>{displayEmoji}</Text>
        </View>

        {/* Habit Name */}
        <Text
          style={styles.habitName}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessible={false}
        >
          {displayName}
        </Text>
      </View>

      {/* Badge Row: Frequency • Time of Day • Reminder */}
      <View style={styles.badgeRow}>
        {/* Frequency Badge */}
        <View style={styles.frequencyBadge}>
          <Text style={styles.frequencyText}>{frequencyText}</Text>
        </View>

        {/* Separator */}
        {timeOfDayInfo && <Text style={styles.separator}>•</Text>}

        {/* Time of Day */}
        {timeOfDayInfo && (
          <Text style={styles.badgeText}>
            {timeOfDayInfo.icon} {timeOfDayInfo.shortLabel}
          </Text>
        )}

        {/* Reminder Badge */}
        {reminderEnabled && (
          <>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.badgeText}>🔔 {reminderTime}</Text>
          </>
        )}
      </View>
    </LinearGradient>
  );
});

LivePreviewCard.displayName = 'LivePreviewCard';

const styles = StyleSheet.create({
  container: {
    marginTop: 20, // mt-5
    marginBottom: 20, // mb-5
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderColor: '#E5E7EB', // stone-200
    padding: 16, // p-4
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8, // mb-2
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#78716C', // stone-500
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
  },
  liveText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B', // amber-600
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
    marginBottom: 12, // mb-3
  },
  emojiContainer: {
    width: 56, // w-14
    height: 56, // h-14
    borderRadius: 16, // rounded-2xl
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  habitName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1917', // stone-900
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // gap-1.5
    marginTop: 4, // mt-1
  },
  frequencyBadge: {
    paddingHorizontal: 8, // px-2
    paddingVertical: 2, // py-0.5
    borderRadius: 6, // rounded-md
    backgroundColor: '#D1FAE5', // emerald-50
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#047857', // emerald-700
  },
  separator: {
    fontSize: 12,
    color: '#D6D3D1', // stone-300
  },
  badgeText: {
    fontSize: 12,
    color: '#78716C', // stone-500
  },
});

export default LivePreviewCard;
