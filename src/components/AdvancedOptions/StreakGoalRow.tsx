/** "Streak goal" panel row — preset chips plus a live custom stepper. */
import { useState } from 'react';
import { Target } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { HelperLine } from './panel/HelperLine';
import { OptionChip } from './panel/OptionChip';
import { OptionChipRow } from './panel/OptionChipRow';
import { PanelRow } from './panel/PanelRow';
import { usePanelTokens } from './panel/panelTokens';
import {
  CUSTOM_STREAK_DEFAULT,
  isPresetStreak,
  STREAK_PRESETS,
} from './streakGoal.constants';
import { StreakGoalStepper } from './StreakGoalStepper';

interface Props {
  streakGoal: number;
  onStreakGoalChange: (days: number) => void;
  open: boolean;
  onToggle: () => void;
  divided: boolean;
}

export function StreakGoalRow({
  streakGoal,
  onStreakGoalChange,
  open,
  onToggle,
  divided,
}: Props) {
  const t = usePanelTokens();
  const isCustom = streakGoal > 0 && !isPresetStreak(streakGoal);
  const [customOpen, setCustomOpen] = useState(isCustom);

  return (
    <PanelRow
      accessibilityLabel='Streak goal'
      divided={divided}
      hint='A target. No penalty if missed.'
      hue='streak'
      icon={
        <Target
          color={t.hues.streak.ink}
          size={iconSizes.small}
          strokeWidth={2}
        />
      }
      open={open}
      title='Streak goal'
      value={
        streakGoal > 0
          ? { label: `${streakGoal} days`, set: true }
          : { label: 'Set', set: false }
      }
      onToggle={onToggle}
    >
      <OptionChipRow>
        {STREAK_PRESETS.map((p) => (
          <OptionChip
            key={p.days}
            accessibilityLabel={
              p.days === 0 ? 'No streak goal' : `${p.days} day streak goal`
            }
            label={p.chipLabel}
            selected={!customOpen && streakGoal === p.days}
            suggested={p.recommended}
            value={p.valueLabel}
            onPress={() => {
              setCustomOpen(false);
              onStreakGoalChange(p.days);
            }}
          />
        ))}
        <OptionChip
          accessibilityLabel='Custom streak goal'
          label='CUSTOM'
          selected={customOpen || isCustom}
          testID='streak-custom-chip'
          value={isCustom ? String(streakGoal) : '···'}
          onPress={() => {
            setCustomOpen(true);
            if (!isCustom) onStreakGoalChange(CUSTOM_STREAK_DEFAULT);
          }}
        />
      </OptionChipRow>
      {customOpen || isCustom ? (
        <StreakGoalStepper
          days={isCustom ? streakGoal : CUSTOM_STREAK_DEFAULT}
          onDaysChange={onStreakGoalChange}
        />
      ) : null}
      <HelperLine>SUGGESTED · MOST NEW HABITS STICK AFTER A WEEK</HelperLine>
    </PanelRow>
  );
}
