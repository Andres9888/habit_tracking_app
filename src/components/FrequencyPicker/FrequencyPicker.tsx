/**
 * FrequencyPicker - Select habit tracking frequency
 *
 * Supports: Daily, Specific Days, X Times per Week, Every X Days
 */

import React, { memo, useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { frequencyPickerStyles as styles } from './FrequencyPicker.styles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FrequencyType = 'daily' | 'specific_days' | 'times_per_week' | 'every_x_days';

export interface FrequencyValue {
  frequency: FrequencyType;
  daysOfWeek?: number[];    // 0=Sun..6=Sat for specific_days
  timesPerWeek?: number;    // for times_per_week
  everyXDays?: number;      // for every_x_days
}

interface FrequencyPickerProps {
  value: FrequencyValue;
  onChange: (value: FrequencyValue) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FREQUENCY_OPTIONS: { key: FrequencyType; label: string; icon: string }[] = [
  { key: 'daily', label: 'Every day', icon: '📅' },
  { key: 'specific_days', label: 'Specific days', icon: '📌' },
  { key: 'times_per_week', label: 'X times / week', icon: '🔢' },
  { key: 'every_x_days', label: 'Every X days', icon: '🔁' },
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TIMES_OPTIONS = [1, 2, 3, 4, 5, 6];
const INTERVAL_OPTIONS = [2, 3, 4, 5, 7, 10, 14];

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function DaySelector({
  selected,
  onToggle,
  colors,
}: {
  selected: number[];
  onToggle: (day: number) => void;
  colors: ReturnType<typeof useThemeColors>['colors'];
}) {
  return (
    <View style={styles.dayRow}>
      {DAY_LABELS.map((label, idx) => {
        const isActive = selected.includes(idx);
        return (
          <Pressable
            key={label}
            accessibilityLabel={`${label}${isActive ? ', selected' : ''}`}
            accessibilityRole='button'
            style={[
              styles.dayChip,
              { borderColor: isActive ? '#059669' : colors.cardBorder },
              isActive && styles.dayChipActive,
            ]}
            onPress={() => onToggle(idx)}
          >
            <Text
              style={[
                styles.dayChipText,
                { color: isActive ? '#ffffff' : colors.text.secondary },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function NumberSelector({
  options,
  selected,
  onSelect,
  suffix,
  colors,
}: {
  options: number[];
  selected: number;
  onSelect: (n: number) => void;
  suffix: string;
  colors: ReturnType<typeof useThemeColors>['colors'];
}) {
  return (
    <View style={styles.numberRow}>
      {options.map((n) => {
        const isActive = selected === n;
        return (
          <Pressable
            key={n}
            accessibilityLabel={`${n} ${suffix}${isActive ? ', selected' : ''}`}
            accessibilityRole='button'
            style={[
              styles.numberChip,
              { borderColor: isActive ? '#059669' : colors.cardBorder },
              isActive && styles.numberChipActive,
            ]}
            onPress={() => onSelect(n)}
          >
            <Text
              style={[
                styles.numberChipText,
                { color: isActive ? '#ffffff' : colors.text.secondary },
              ]}
            >
              {n}{suffix}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function FrequencyPickerComponent({ value, onChange }: FrequencyPickerProps) {
  const { colors } = useThemeColors();

  const handleFrequencySelect = useCallback(
    (key: FrequencyType) => {
      const base: FrequencyValue = { frequency: key };
      if (key === 'specific_days') {
        base.daysOfWeek = value.daysOfWeek?.length ? value.daysOfWeek : [1, 3, 5]; // Mon, Wed, Fri
      }
      if (key === 'times_per_week') {
        base.timesPerWeek = value.timesPerWeek ?? 3;
      }
      if (key === 'every_x_days') {
        base.everyXDays = value.everyXDays ?? 2;
      }
      onChange(base);
    },
    [onChange, value]
  );

  const handleDayToggle = useCallback(
    (day: number) => {
      const current = value.daysOfWeek ?? [];
      const next = current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day].sort();
      // Don't allow empty selection
      if (next.length === 0) return;
      onChange({ ...value, daysOfWeek: next });
    },
    [onChange, value]
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>FREQUENCY</Text>
      <View style={styles.optionsRow}>
        {FREQUENCY_OPTIONS.map(({ key, label, icon }) => {
          const isActive = value.frequency === key;
          return (
            <Pressable
              key={key}
              accessibilityLabel={`${label}${isActive ? ', selected' : ''}`}
              accessibilityRole='button'
              style={[
                styles.optionCard,
                {
                  borderColor: isActive ? '#059669' : colors.cardBorder,
                  backgroundColor: isActive ? '#05966915' : colors.card,
                },
              ]}
              onPress={() => handleFrequencySelect(key)}
            >
              <Text style={styles.optionIcon}>{icon}</Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.optionLabel,
                  { color: isActive ? '#047857' : colors.text.primary },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {value.frequency === 'specific_days' && (
        <DaySelector
          colors={colors}
          selected={value.daysOfWeek ?? []}
          onToggle={handleDayToggle}
        />
      )}

      {value.frequency === 'times_per_week' && (
        <NumberSelector
          colors={colors}
          options={TIMES_OPTIONS}
          selected={value.timesPerWeek ?? 3}
          suffix='x/wk'
          onSelect={(n) => onChange({ ...value, timesPerWeek: n })}
        />
      )}

      {value.frequency === 'every_x_days' && (
        <NumberSelector
          colors={colors}
          options={INTERVAL_OPTIONS}
          selected={value.everyXDays ?? 2}
          suffix='d'
          onSelect={(n) => onChange({ ...value, everyXDays: n })}
        />
      )}
    </View>
  );
}

export const FrequencyPicker = memo(FrequencyPickerComponent);
