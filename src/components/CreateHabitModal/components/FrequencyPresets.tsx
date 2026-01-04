/**
 * FrequencyPresets Component - Cards V1 Improved Spec
 * Task 8: Create FrequencyPresets Component
 *
 * Features:
 * - Quick preset buttons for common frequency patterns (Daily, Weekdays, Weekends)
 * - Visual distinction between active and inactive presets
 * - Haptic feedback on press
 * - Automatic detection of active preset from selectedDays array
 */

import React, { useMemo, useCallback, memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

/**
 * Preset types available for quick selection
 */
export type PresetType = 'daily' | 'weekdays' | 'weekends';

/**
 * Preset definitions mapping to boolean arrays for days of the week
 * Array index: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
 */
export const PRESETS: Record<PresetType, boolean[]> = {
  daily: [true, true, true, true, true, true, true],     // All days
  weekdays: [false, true, true, true, true, true, false], // Mon-Fri
  weekends: [true, false, false, false, false, false, true], // Sat-Sun
};

/**
 * Props for FrequencyPresets component
 */
export interface FrequencyPresetsProps {
  /**
   * Currently selected days (7-element boolean array)
   * Array index: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
   */
  selectedDays: boolean[];
  /**
   * Callback when a preset is selected
   * @param days - The new selectedDays array for the preset
   */
  onPresetSelect: (days: boolean[]) => void;
}

/**
 * Detects which preset (if any) matches the current selectedDays array
 * @param selectedDays - Current day selection state
 * @returns The matching preset type, or null if no match
 */
const getActivePreset = (selectedDays: boolean[]): PresetType | null => {
  const presetEntries = Object.entries(PRESETS) as [PresetType, boolean[]][];
  const match = presetEntries.find(
    ([_, days]) => JSON.stringify(days) === JSON.stringify(selectedDays)
  );
  return match ? match[0] : null;
};

/**
 * PresetButton component for individual preset options
 */
interface PresetButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const PresetButton = memo<PresetButtonProps>(({ label, active, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label} preset${active ? ', selected' : ''}`}
      style={({ pressed }) => [
        styles.presetButton,
        active ? styles.presetButtonActive : styles.presetButtonInactive,
        pressed && styles.presetButtonPressed,
      ]}
    >
      <Text
        style={[
          styles.presetButtonText,
          active
            ? styles.presetButtonTextActive
            : styles.presetButtonTextInactive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
});

PresetButton.displayName = 'PresetButton';

/**
 * FrequencyPresets displays quick preset buttons for common frequency patterns
 *
 * Design specs:
 * - 3 preset buttons: Daily, Weekdays, Weekends
 * - Active preset has emerald-500 bg, white text, and shadow
 * - Inactive presets have stone-100 bg, stone-600 text, and border
 * - Automatically detects and highlights active preset
 * - Includes haptic feedback on selection
 *
 * @param props - FrequencyPresets component props
 * @returns JSX.Element
 */
export const FrequencyPresets = memo<FrequencyPresetsProps>(
  ({ selectedDays, onPresetSelect }) => {
    const { triggerSelection } = useHapticFeedback();

    // Detect which preset (if any) is currently active
    const activePreset = useMemo(
      () => getActivePreset(selectedDays),
      [selectedDays]
    );

    // Handle preset selection with haptic feedback
    const handlePresetPress = useCallback(
      (preset: PresetType) => {
        triggerSelection();
        onPresetSelect(PRESETS[preset]);
      },
      [onPresetSelect, triggerSelection]
    );

    return (
      <View style={styles.container}>
        {/* Label row */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>Repeat on</Text>

          {/* Preset buttons */}
          <View style={styles.buttonRow}>
            <PresetButton
              label="Daily"
              active={activePreset === 'daily'}
              onPress={() => handlePresetPress('daily')}
            />
            <PresetButton
              label="Weekdays"
              active={activePreset === 'weekdays'}
              onPress={() => handlePresetPress('weekdays')}
            />
            <PresetButton
              label="Weekends"
              active={activePreset === 'weekends'}
              onPress={() => handlePresetPress('weekends')}
            />
          </View>
        </View>
      </View>
    );
  }
);

FrequencyPresets.displayName = 'FrequencyPresets';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8, // mb-2
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#78716C', // stone-500
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6, // gap-1.5
  },
  presetButton: {
    paddingHorizontal: 10, // px-2.5
    paddingVertical: 4,   // py-1
    borderRadius: 8,      // rounded-lg
  },
  presetButtonActive: {
    backgroundColor: '#10B981', // emerald-500
    // Shadow for active state
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  presetButtonInactive: {
    backgroundColor: '#F5F5F4', // stone-100
    borderWidth: 1,
    borderColor: '#E7E5E4', // stone-200
  },
  presetButtonPressed: {
    opacity: 0.8,
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  presetButtonTextActive: {
    color: '#FFFFFF',
  },
  presetButtonTextInactive: {
    color: '#57534E', // stone-600
  },
});
