/**
 * StreakRecoveryModal - Prompt to use a Streak Freeze on app open
 *
 * When a user opens the app and has missed yesterday (broken streak) but has
 * streak freezes available (premium), shows a modal offering to freeze.
 *
 * "You missed yesterday! Use a Streak Freeze to keep your X-day streak alive?"
 * [Use Freeze] [Skip]
 */

import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { Modal } from '../Modal';
import { useThemeColors } from '../../theme/ThemeContext';
import type { StreakRecoveryModalProps } from './types';
import { ActionButton } from './ActionButton';

export function StreakRecoveryModal({
  visible,
  onClose,
  eligibleHabits,
  freezesRemaining,
  onUseFreeze,
}: StreakRecoveryModalProps) {
  const { colors } = useThemeColors();
  const [loadingHabitId, setLoadingHabitId] = useState<string | null>(null);
  const [frozenHabits, setFrozenHabits] = useState<Set<string>>(new Set());

  const handleUseFreeze = useCallback(
    async (habitId: string) => {
      setLoadingHabitId(habitId);
      try {
        await onUseFreeze(habitId);
        setFrozenHabits((prev) => new Set([...prev, habitId]));
      } finally {
        setLoadingHabitId(null);
      }
    },
    [onUseFreeze]
  );

  const remainingHabits = eligibleHabits.filter(
    (h) => !frozenHabits.has(h.habitId)
  );

  // Auto-close when all habits handled
  if (visible && remainingHabits.length === 0 && frozenHabits.size > 0) {
    // Delay slightly so user sees the last one resolve
    setTimeout(onClose, 300);
  }

  return (
    <Modal variant="center" visible={visible} onClose={onClose}>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          maxWidth: 360,
          padding: 24,
          width: '100%',
        }}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>❄️</Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: '700',
              textAlign: 'center',
            }}
          >
            Streak Recovery
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              marginTop: 4,
              textAlign: 'center',
            }}
          >
            {freezesRemaining} freeze{freezesRemaining !== 1 ? 's' : ''}{' '}
            remaining this month
          </Text>
        </View>

        {/* Habit cards */}
        {remainingHabits.map((habit) => (
          <View
            key={habit.habitId}
            style={{
              backgroundColor: colors.background,
              borderRadius: 12,
              marginBottom: 12,
              padding: 16,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 15,
                lineHeight: 22,
                textAlign: 'center',
              }}
            >
              You missed yesterday! Use a Streak Freeze to keep your{' '}
              <Text style={{ fontWeight: '700' }}>
                {habit.currentStreak}-day
              </Text>{' '}
              streak on {habit.habitEmoji} {habit.habitName} alive?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'center',
                marginTop: 14,
              }}
            >
              <ActionButton
                color="#059669"
                disabled={loadingHabitId !== null}
                label="Use Freeze ❄️"
                loading={loadingHabitId === habit.habitId}
                onPress={() => void handleUseFreeze(habit.habitId)}
              />
              <ActionButton
                color={colors.textSecondary}
                disabled={loadingHabitId !== null}
                label="Skip"
                variant="outline"
                onPress={onClose}
              />
            </View>
          </View>
        ))}
      </View>
    </Modal>
  );
}
