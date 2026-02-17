/**
 * FrequencyPicker Component
 *
 * Allows users to select habit frequency options:
 * - Daily (every day)
 * - Weekly (X times per week, 1-7)
 * - Specific days of week (e.g., MWF)
 * - Every X days (2, 3, 7, 14, 30)
 */

import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { FrequencyConfig } from '../../../../../convex/habits/frequency';
import { getFrequencyIcon, getFrequencyDescription } from '../../../../../convex/habits/frequency';
import { styles } from './FrequencyPicker.styles';

export interface FrequencyPickerProps {
  selectedConfig: FrequencyConfig;
  onSelect: (config: FrequencyConfig) => void;
}

export function FrequencyPicker({ selectedConfig, onSelect }: FrequencyPickerProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const [selectedType, setSelectedType] = useState<FrequencyConfig['type']>(
    selectedConfig.type || 'daily'
  );

  const frequencyTypes: Array<{
    type: FrequencyConfig['type'];
    label: string;
    description: string;
    icon: string;
  }> = [
    { type: 'daily', label: 'Daily', description: 'Every day', icon: '📅' },
    { type: 'weekly', label: 'Times per week', description: 'Pick a number (1-7)', icon: '📊' },
    { type: 'days', label: 'Specific days', description: 'Choose days of the week', icon: '🗓️' },
    { type: 'interval', label: 'Every X days', description: 'Set an interval (2, 3, 7, 14, 30)', icon: '🔄' },
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const intervalOptions: Array<{ value: 2 | 3 | 7 | 14 | 30; label: string }> = [
    { value: 2, label: 'Every 2 days' },
    { value: 3, label: 'Every 3 days' },
    { value: 7, label: 'Weekly (7 days)' },
    { value: 14, label: 'Every 2 weeks' },
    { value: 30, label: 'Monthly (30 days)' },
  ];

  const renderFrequencyTypeOption = ({
    type,
    label,
    description,
    icon,
  }: {
    type: FrequencyConfig['type'];
    label: string;
    description: string;
    icon: string;
  }) => {
    const isSelected = selectedType === type;
    return (
      <TouchableOpacity
        key={type}
        style={[
          styles.frequencyTypeOption,
          {
            backgroundColor: isSelected
              ? isDark
                ? themeColors.cardBorder
                : themeColors.cardBorder + '20'
              : 'transparent',
            borderColor: isSelected ? themeColors.cardBorder : 'transparent',
          },
        ]}
        onPress={() => {
          setSelectedType(type);
          // Default config for each type
          const defaultConfig: FrequencyConfig = {
            type,
            ...(type === 'weekly' && { timesPerWeek: 3 }),
            ...(type === 'days' && { daysOfWeek: [1, 3, 5] }),
            ...(type === 'interval' && { intervalDays: 7 }),
          };
          onSelect(defaultConfig);
        }}
        accessibilityRole='radio'
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${label}: ${description}`}
      >
        <Text style={styles.frequencyTypeIcon}>{icon}</Text>
        <View style={styles.frequencyTypeTextContainer}>
          <Text
            style={[
              styles.frequencyTypeLabel,
              { color: themeColors.text.primary },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.frequencyTypeDescription,
              { color: themeColors.text.tertiary },
            ]}
          >
            {description}
          </Text>
        </View>
        {isSelected && (
          <View
            style={[
              styles.selectedIndicator,
              { backgroundColor: themeColors.cardBorder },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderDaySelector = () => {
    if (selectedType !== 'days') return null;

    const daysOfWeek = selectedConfig.daysOfWeek || [];

    return (
      <View style={styles.daySelectorContainer}>
        <Text
          style={[styles.subsectionLabel, { color: themeColors.text.primary }]}
        >
          Select days
        </Text>
        <View style={styles.daySelectorRow}>
          {weekDays.map((day, index) => {
            const isSelected = daysOfWeek.includes(index);
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  {
                    backgroundColor: isSelected
                      ? themeColors.cardBorder
                      : isDark
                        ? themeColors.card
                        : '#FFFFFF',
                    borderColor: themeColors.cardBorder,
                  },
                ]}
                onPress={() => {
                  const newDays = isSelected
                    ? daysOfWeek.filter((d) => d !== index)
                    : [...daysOfWeek, index].sort();
                  onSelect({ type: 'days', daysOfWeek: newDays });
                }}
                accessibilityRole='checkbox'
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={day}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    {
                      color: isSelected ? '#FFFFFF' : themeColors.text.primary,
                    },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderTimesPerWeekSelector = () => {
    if (selectedType !== 'weekly') return null;

    const timesPerWeek = selectedConfig.timesPerWeek || 3;

    return (
      <View style={styles.timesPerWeekContainer}>
        <Text
          style={[styles.subsectionLabel, { color: themeColors.text.primary }]}
        >
          Times per week
        </Text>
        <View style={styles.timesPerWeekRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => {
            const isSelected = timesPerWeek === num;
            return (
              <TouchableOpacity
                key={num}
                style={[
                  styles.timesPerWeekButton,
                  {
                    backgroundColor: isSelected
                      ? themeColors.cardBorder
                      : isDark
                        ? themeColors.card
                        : '#FFFFFF',
                    borderColor: themeColors.cardBorder,
                  },
                ]}
                onPress={() => onSelect({ type: 'weekly', timesPerWeek: num })}
                accessibilityRole='radio'
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${num} time${num === 1 ? '' : 's'} per week`}
              >
                <Text
                  style={[
                    styles.timesPerWeekButtonText,
                    {
                      color: isSelected ? '#FFFFFF' : themeColors.text.primary,
                    },
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderIntervalSelector = () => {
    if (selectedType !== 'interval') return null;

    const intervalDays = selectedConfig.intervalDays || 7;

    return (
      <View style={styles.intervalContainer}>
        <Text
          style={[styles.subsectionLabel, { color: themeColors.text.primary }]}
        >
          Interval
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.intervalScrollContent}
        >
          {intervalOptions.map((option) => {
            const isSelected = intervalDays === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.intervalButton,
                  {
                    backgroundColor: isSelected
                      ? themeColors.cardBorder
                      : isDark
                        ? themeColors.card
                        : '#FFFFFF',
                    borderColor: themeColors.cardBorder,
                  },
                ]}
                onPress={() =>
                  onSelect({ type: 'interval', intervalDays: option.value })
                }
                accessibilityRole='radio'
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={option.label}
              >
                <Text
                  style={[
                    styles.intervalButtonText,
                    {
                      color: isSelected ? '#FFFFFF' : themeColors.text.primary,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: themeColors.text.primary }]}>
        How often?
      </Text>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {frequencyTypes.map(renderFrequencyTypeOption)}

        {renderDaySelector()}
        {renderTimesPerWeekSelector()}
        {renderIntervalSelector()}

        {/* Preview */}
        <View
          style={[
            styles.previewContainer,
            {
              backgroundColor: isDark ? themeColors.card : '#F5F5F5',
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.previewLabel,
              { color: themeColors.text.tertiary },
            ]}
          >
            This habit will be:
          </Text>
          <View style={styles.previewRow}>
            <Text style={styles.previewIcon}>
              {getFrequencyIcon(selectedConfig)}
            </Text>
            <Text
              style={[
                styles.previewText,
                { color: themeColors.text.primary },
              ]}
            >
              {getFrequencyDescription(selectedConfig)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default FrequencyPicker;
