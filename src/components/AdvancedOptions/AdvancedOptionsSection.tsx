/** "More to customize" panel — closed rows that open one at a time. */
import { useState } from 'react';
import { View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { GrowthIconsRow } from './GrowthIconsRow';
import { PanelCard } from './panel/PanelCard';
import { SectionLabel } from './panel/SectionLabel';
import { ReminderRow } from './reminder/ReminderRow';
import { StreakGoalRow } from './StreakGoalRow';
import { StrengthCurveRow } from './StrengthCurveRow';
import { useAdvancedOptionsSummary } from './useAdvancedOptionsSummary';
import { useScrollOnExpand } from './useScrollOnExpand';
import { WhyRow } from './WhyRow';
import type {
  AdvancedOptionsSectionProps,
  PanelRowKey,
} from './AdvancedOptions.types';

// eslint-disable-next-line max-lines-per-function
export function AdvancedOptionsSection({
  growthType,
  isNewHabit,
  strengthAlgorithm,
  progressEmojis,
  streakGoal,
  onStrengthAlgorithmChange,
  onProgressEmojisChange,
  onStreakGoalChange,
  onExpand,
  why,
  onWhyChange,
  habitIcon,
  reminder,
}: AdvancedOptionsSectionProps) {
  const [openRow, setOpenRow] = useState<PanelRowKey | null>(null);
  const reduceMotion = useReduceMotion();
  useScrollOnExpand(openRow !== null, reduceMotion, onExpand);
  const { userDefaultEmojis, savedCustomEmojis } =
    useAdvancedOptionsSummary(progressEmojis);

  const toggle = (key: PanelRowKey) => () => {
    void triggerHaptic('selection');
    setOpenRow((current) => (current === key ? null : key));
  };
  const whyEnabled = Boolean(onWhyChange);

  return (
    <View className='mt-6 px-6'>
      <SectionLabel action={{ text: 'Optional' }} label='More to customize' />
      <PanelCard>
        {reminder ? (
          <ReminderRow
            divided={false}
            open={openRow === 'reminder'}
            reminder={reminder}
            onToggleOpen={toggle('reminder')}
          />
        ) : null}
        {onWhyChange ? (
          <WhyRow
            divided={Boolean(reminder)}
            open={openRow === 'why'}
            why={why ?? ''}
            onToggle={toggle('why')}
            onWhyChange={onWhyChange}
          />
        ) : null}
        <StreakGoalRow
          divided={Boolean(reminder) || whyEnabled}
          open={openRow === 'streak'}
          streakGoal={streakGoal}
          onStreakGoalChange={onStreakGoalChange}
          onToggle={toggle('streak')}
        />
        <StrengthCurveRow
          divided
          growthType={growthType}
          isNewHabit={isNewHabit}
          open={openRow === 'curve'}
          strengthAlgorithm={strengthAlgorithm}
          onSelect={onStrengthAlgorithmChange}
          onToggle={toggle('curve')}
        />
        <GrowthIconsRow
          divided
          fallback={userDefaultEmojis}
          habitIcon={habitIcon}
          open={openRow === 'growth'}
          savedCustom={savedCustomEmojis}
          value={progressEmojis}
          onChange={onProgressEmojisChange}
          onToggle={toggle('growth')}
        />
      </PanelCard>
    </View>
  );
}
