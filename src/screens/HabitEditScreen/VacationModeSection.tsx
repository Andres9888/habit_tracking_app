/**
 * VacationModeSection — Streak Insurance (Premium)
 *
 * Lets users set vacation date ranges so their habit streaks are
 * paused (neither broken nor growing) during vacations.
 *
 * Premium-only. Shows upgrade prompt for free users.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Switch,
  Pressable,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useThemeColors } from '../../theme/ThemeContext';

interface VacationPeriod {
  end: string;
  start: string;
}

interface VacationModeSectionProps {
  habitId: Id<'habits'> | null;
  vacationMode: boolean;
  vacationPeriods: VacationPeriod[];
  isPremium: boolean;
  onUpgradePress: () => void;
}

type DatePickerTarget = 'start' | 'end';

function formatDisplay(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function VacationModeSection({
  habitId,
  vacationMode,
  vacationPeriods,
  isPremium,
  onUpgradePress,
}: VacationModeSectionProps) {
  const { colors } = useThemeColors();
  const setVacationMode = useMutation(api.habits.setVacationMode);
  const addVacationPeriod = useMutation(api.habits.addVacationPeriod);
  const removeVacationPeriod = useMutation(api.habits.removeVacationPeriod);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<DatePickerTarget>('start');
  const [draftStart, setDraftStart] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [draftEnd, setDraftEnd] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const handleToggleVacationMode = useCallback(
    async (value: boolean) => {
      if (!habitId) return;
      if (!isPremium) {
        onUpgradePress();
        return;
      }
      try {
        await setVacationMode({ habitId, enabled: value });
      } catch (e) {
        Alert.alert('Error', 'Failed to update vacation mode.');
      }
    },
    [habitId, isPremium, setVacationMode, onUpgradePress]
  );

  const handleDateChange = useCallback(
    (_event: unknown, selected?: Date) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
      if (!selected) return;
      const dateStr = format(selected, 'yyyy-MM-dd');
      if (pickerTarget === 'start') {
        setDraftStart(dateStr);
        // Ensure end >= start
        if (dateStr > draftEnd) setDraftEnd(dateStr);
      } else {
        setDraftEnd(dateStr);
        // Ensure start <= end
        if (dateStr < draftStart) setDraftStart(dateStr);
      }
    },
    [pickerTarget, draftStart, draftEnd]
  );

  const openPicker = useCallback((target: DatePickerTarget) => {
    setPickerTarget(target);
    setShowDatePicker(true);
  }, []);

  const handleAddPeriod = useCallback(async () => {
    if (!habitId) return;
    if (!isPremium) {
      onUpgradePress();
      return;
    }
    try {
      await addVacationPeriod({
        habitId,
        start: draftStart,
        end: draftEnd,
      });
      // Reset draft to today
      const today = format(new Date(), 'yyyy-MM-dd');
      setDraftStart(today);
      setDraftEnd(today);
    } catch (e) {
      Alert.alert('Error', 'Failed to add vacation period.');
    }
  }, [habitId, isPremium, addVacationPeriod, draftStart, draftEnd, onUpgradePress]);

  const handleRemovePeriod = useCallback(
    (index: number) => {
      if (!habitId) return;
      Alert.alert('Remove Vacation?', 'Delete this vacation period?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeVacationPeriod({ habitId, index });
            } catch {
              Alert.alert('Error', 'Failed to remove vacation period.');
            }
          },
        },
      ]);
    },
    [habitId, removeVacationPeriod]
  );

  if (!isPremium) {
    return (
      <Pressable
        accessibilityRole='button'
        accessibilityLabel='Upgrade to unlock Streak Insurance'
        onPress={onUpgradePress}
        style={{
          borderRadius: 16,
          backgroundColor: colors.surface ?? '#F9FAFB',
          borderWidth: 1.5,
          borderColor: '#8b5cf6',
          borderStyle: 'dashed',
          padding: 16,
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 28 }}>🏖️</Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '700',
            color: '#8b5cf6',
            textAlign: 'center',
          }}
        >
          Streak Insurance
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.text?.secondary ?? '#6B7280',
            textAlign: 'center',
            lineHeight: 18,
          }}
        >
          Protect your streak during vacations. Streak pauses — never breaks.
        </Text>
        <View
          style={{
            backgroundColor: '#8b5cf6',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginTop: 4,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>
            🔒 Premium Only — Upgrade
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {/* Toggle row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.surface ?? '#F9FAFB',
          borderRadius: 12,
          padding: 14,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontSize: 22 }}>🏖️</Text>
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: colors.text?.primary ?? '#111827',
              }}
            >
              Vacation Mode
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.text?.secondary ?? '#6B7280',
                marginTop: 2,
              }}
            >
              Streak pauses during vacation
            </Text>
          </View>
        </View>
        <Switch
          value={vacationMode}
          onValueChange={(v) => void handleToggleVacationMode(v)}
          trackColor={{ true: '#059669', false: undefined }}
          thumbColor={vacationMode ? '#fff' : undefined}
        />
      </View>

      {/* Vacation periods list */}
      {vacationPeriods.length > 0 && (
        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.text?.secondary ?? '#6B7280',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            Scheduled Vacations
          </Text>
          {vacationPeriods.map((period, index) => (
            <View
              key={`${period.start}-${period.end}-${index}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FEF3C7',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: '#FDE68A',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 16 }}>📅</Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: '#92400E',
                  }}
                >
                  {formatDisplay(period.start)} → {formatDisplay(period.end)}
                </Text>
              </View>
              <Pressable
                onPress={() => handleRemovePeriod(index)}
                accessibilityLabel='Remove vacation period'
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ fontSize: 18, color: '#92400E' }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Add vacation period */}
      <View
        style={{
          backgroundColor: colors.surface ?? '#F9FAFB',
          borderRadius: 12,
          padding: 14,
          gap: 10,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: colors.text?.secondary ?? '#6B7280',
            letterSpacing: 0.3,
          }}
        >
          Add Vacation Period
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Start date */}
          <Pressable
            style={{
              flex: 1,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: pickerTarget === 'start' && showDatePicker ? '#059669' : (colors.border ?? '#E5E7EB'),
              backgroundColor: colors.background ?? '#fff',
              padding: 10,
              alignItems: 'center',
            }}
            onPress={() => openPicker('start')}
          >
            <Text style={{ fontSize: 11, color: colors.text?.secondary ?? '#6B7280', marginBottom: 3 }}>
              Start
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text?.primary ?? '#111827' }}>
              {formatDisplay(draftStart)}
            </Text>
          </Pressable>

          <View style={{ justifyContent: 'center' }}>
            <Text style={{ color: colors.text?.secondary ?? '#6B7280' }}>→</Text>
          </View>

          {/* End date */}
          <Pressable
            style={{
              flex: 1,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: pickerTarget === 'end' && showDatePicker ? '#059669' : (colors.border ?? '#E5E7EB'),
              backgroundColor: colors.background ?? '#fff',
              padding: 10,
              alignItems: 'center',
            }}
            onPress={() => openPicker('end')}
          >
            <Text style={{ fontSize: 11, color: colors.text?.secondary ?? '#6B7280', marginBottom: 3 }}>
              End
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text?.primary ?? '#111827' }}>
              {formatDisplay(draftEnd)}
            </Text>
          </Pressable>
        </View>

        {showDatePicker && (
          <DateTimePicker
            mode='date'
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            value={parseISO(pickerTarget === 'start' ? draftStart : draftEnd)}
            minimumDate={pickerTarget === 'end' ? parseISO(draftStart) : undefined}
            onChange={handleDateChange}
          />
        )}

        {/* Add button */}
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Add vacation period'
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#047857' : '#059669',
            borderRadius: 10,
            padding: 12,
            alignItems: 'center',
          })}
          onPress={() => void handleAddPeriod()}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
            + Add Vacation
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
