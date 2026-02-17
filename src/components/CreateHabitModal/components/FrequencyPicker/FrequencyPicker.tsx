/**
 * FrequencyPicker — lets users choose how often a habit repeats.
 *
 * Options:
 *   • Every day (daily)
 *   • Specific days of the week
 *   • X times per week
 *   • Every X days
 */

import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { FrequencyPickerProps } from './FrequencyPicker.types';
import type { FrequencyType } from './FrequencyPicker.types';
import {
  buildFrequencyString,
  getDayLabelsShort,
  parseFrequency,
} from './frequencyUtils';

const FREQUENCY_OPTIONS: { type: FrequencyType; label: string; icon: string }[] = [
  { type: 'daily', label: 'Every day', icon: '📅' },
  { type: 'specific_days', label: 'Specific days', icon: '📆' },
  { type: 'x_per_week', label: 'X per week', icon: '🔢' },
  { type: 'every_x_days', label: 'Every X days', icon: '🔄' },
];

const DAY_LABELS = getDayLabelsShort();

function FrequencyPickerComponent({
  frequency,
  daysOfWeek,
  onFrequencyChange,
  onDaysOfWeekChange,
}: FrequencyPickerProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const parsed = useMemo(() => parseFrequency(frequency), [frequency]);
  const [expanded, setExpanded] = useState(false);

  // Local param state for numeric inputs
  const [timesPerWeek, setTimesPerWeek] = useState(parsed.param ?? 3);
  const [intervalDays, setIntervalDays] = useState(parsed.param ?? 2);

  const handleTypeSelect = useCallback(
    (type: FrequencyType) => {
      let freq: string;
      switch (type) {
        case 'x_per_week':
          freq = buildFrequencyString(type, timesPerWeek);
          break;
        case 'every_x_days':
          freq = buildFrequencyString(type, intervalDays);
          break;
        default:
          freq = buildFrequencyString(type);
      }
      onFrequencyChange(freq);
    },
    [onFrequencyChange, timesPerWeek, intervalDays]
  );

  const handleDayToggle = useCallback(
    (day: number) => {
      const newDays = daysOfWeek.includes(day)
        ? daysOfWeek.filter((d) => d !== day)
        : [...daysOfWeek, day].sort((a, b) => a - b);
      onDaysOfWeekChange(newDays);
    },
    [daysOfWeek, onDaysOfWeekChange]
  );

  const adjustParam = useCallback(
    (delta: number) => {
      if (parsed.type === 'x_per_week') {
        const next = Math.max(1, Math.min(7, timesPerWeek + delta));
        setTimesPerWeek(next);
        onFrequencyChange(buildFrequencyString('x_per_week', next));
      } else if (parsed.type === 'every_x_days') {
        const next = Math.max(1, Math.min(30, intervalDays + delta));
        setIntervalDays(next);
        onFrequencyChange(buildFrequencyString('every_x_days', next));
      }
    },
    [parsed.type, timesPerWeek, intervalDays, onFrequencyChange]
  );

  const currentLabel = useMemo(() => {
    const opt = FREQUENCY_OPTIONS.find((o) => o.type === parsed.type);
    return opt ? `${opt.icon} ${opt.label}` : '📅 Every day';
  }, [parsed.type]);

  return (
    <View style={{ marginBottom: 24 }}>
      {/* Section label */}
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: themeColors.text.tertiary,
          marginBottom: 12,
          letterSpacing: 0.5,
        }}
      >
        FREQUENCY
      </Text>

      {/* Collapsed: show current selection */}
      <Pressable
        accessibilityLabel="Change habit frequency"
        accessibilityRole="button"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: isDark ? themeColors.card : '#F5F5F4',
          borderWidth: 1,
          borderColor: expanded ? '#059669' : 'transparent',
        }}
        onPress={() => setExpanded(!expanded)}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: themeColors.text.primary,
          }}
        >
          {currentLabel}
        </Text>
        <Text
          style={{ fontSize: 14, color: themeColors.text.tertiary }}
        >
          {expanded ? '▲' : '▼'}
        </Text>
      </Pressable>

      {/* Expanded: show all options */}
      {expanded && (
        <View style={{ marginTop: 12 }}>
          {/* Type selection chips */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 16,
            }}
          >
            {FREQUENCY_OPTIONS.map((opt) => {
              const isActive = parsed.type === opt.type;
              return (
                <Pressable
                  key={opt.type}
                  accessibilityLabel={opt.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 10,
                    backgroundColor: isActive
                      ? '#059669'
                      : isDark
                        ? themeColors.card
                        : '#F5F5F4',
                    borderWidth: 1,
                    borderColor: isActive ? '#047857' : 'transparent',
                  }}
                  onPress={() => handleTypeSelect(opt.type)}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: isActive ? '600' : '400',
                      color: isActive ? '#FFFFFF' : themeColors.text.primary,
                    }}
                  >
                    {opt.icon} {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Specific days picker */}
          {parsed.type === 'specific_days' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 4,
              }}
            >
              {DAY_LABELS.map((label, idx) => {
                const isSelected = daysOfWeek.includes(idx);
                return (
                  <Pressable
                    key={idx}
                    accessibilityLabel={`Toggle ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][idx]}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected
                        ? '#059669'
                        : isDark
                          ? themeColors.card
                          : '#F5F5F4',
                      borderWidth: 1,
                      borderColor: isSelected ? '#047857' : 'transparent',
                    }}
                    onPress={() => handleDayToggle(idx)}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: isSelected ? '#FFFFFF' : themeColors.text.primary,
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Numeric stepper for x_per_week / every_x_days */}
          {(parsed.type === 'x_per_week' || parsed.type === 'every_x_days') && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              <Pressable
                accessibilityLabel="Decrease"
                accessibilityRole="button"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDark ? themeColors.card : '#F5F5F4',
                }}
                onPress={() => adjustParam(-1)}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: themeColors.text.primary,
                  }}
                >
                  −
                </Text>
              </Pressable>

              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  color: themeColors.text.primary,
                  minWidth: 40,
                  textAlign: 'center',
                }}
              >
                {parsed.type === 'x_per_week' ? timesPerWeek : intervalDays}
              </Text>

              <Pressable
                accessibilityLabel="Increase"
                accessibilityRole="button"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDark ? themeColors.card : '#F5F5F4',
                }}
                onPress={() => adjustParam(1)}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: themeColors.text.primary,
                  }}
                >
                  +
                </Text>
              </Pressable>

              <Text
                style={{
                  fontSize: 14,
                  color: themeColors.text.secondary,
                }}
              >
                {parsed.type === 'x_per_week'
                  ? `time${timesPerWeek === 1 ? '' : 's'} per week`
                  : `day${intervalDays === 1 ? '' : 's'} between`}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export const FrequencyPicker = memo(FrequencyPickerComponent);
