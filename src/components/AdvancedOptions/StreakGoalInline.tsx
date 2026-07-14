/** Inline Streak Goal — mock Variant B chips + custom expand. */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { StreakGoalChip } from './StreakGoalChip';
import { StreakGoalCustomExpand } from './StreakGoalCustomExpand';
import { StreakGoalSectionHead } from './StreakGoalSectionHead';
import {
  clampStreakDays,
  CUSTOM_STREAK_DEFAULT,
  isPresetStreak,
  STREAK_PRESETS,
} from './streakGoal.constants';

interface Props {
  streakGoal: number;
  onStreakGoalChange: (days: number) => void;
}

export function StreakGoalInline({ streakGoal, onStreakGoalChange }: Props) {
  const isCustomActive = streakGoal > 0 && !isPresetStreak(streakGoal);
  const [customOpen, setCustomOpen] = useState(isCustomActive);
  const [draftDays, setDraftDays] = useState(
    isCustomActive ? streakGoal : CUSTOM_STREAK_DEFAULT
  );

  useEffect(() => {
    if (!isCustomActive) return;
    setDraftDays(streakGoal);
    setCustomOpen(true);
  }, [isCustomActive, streakGoal]);

  return (
    <View>
      <StreakGoalSectionHead />
      {/* marginTop keeps the START badge from colliding with the description */}
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
        {STREAK_PRESETS.map((p) => (
          <StreakGoalChip
            key={p.days}
            accessibilityLabel={
              p.days === 0
                ? 'No streak goal'
                : `${p.days} day streak goal, ${p.chipLabel}`
            }
            chipLabel={p.chipLabel}
            recommended={p.recommended}
            selected={Boolean(!customOpen && streakGoal === p.days)}
            valueLabel={p.valueLabel}
            onPress={() => {
              void triggerHaptic('selection');
              setCustomOpen(false);
              onStreakGoalChange(p.days);
            }}
          />
        ))}
        <StreakGoalChip
          accessibilityLabel='Custom streak goal'
          accent='emerald'
          chipLabel='CUSTOM'
          selected={Boolean(customOpen || isCustomActive)}
          valueLabel={isCustomActive ? String(streakGoal) : '···'}
          onPress={() => {
            void triggerHaptic('selection');
            setCustomOpen(true);
            if (!isCustomActive) setDraftDays(CUSTOM_STREAK_DEFAULT);
          }}
        />
      </View>
      {customOpen ? (
        <StreakGoalCustomExpand
          days={draftDays}
          onApply={() => {
            void triggerHaptic('success');
            const next = clampStreakDays(draftDays);
            setDraftDays(next);
            onStreakGoalChange(next);
          }}
          onDaysChange={setDraftDays}
        />
      ) : null}
    </View>
  );
}
