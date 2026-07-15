/** Title + description for inline Streak Goal. */
import { Target } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { AdvancedOptionsSectionHead } from './AdvancedOptionsSectionHead';
import { useAdvancedTokens } from './useAdvancedTokens';

export function StreakGoalSectionHead({ streakGoal }: { streakGoal: number }) {
  const t = useAdvancedTokens();
  const valueLabel =
    streakGoal > 0
      ? `${streakGoal} day${streakGoal === 1 ? '' : 's'}`
      : 'No goal';

  return (
    <AdvancedOptionsSectionHead
      description='A visual target with no penalty if you miss it.'
      icon={
        <Target color={t.tileIcon} size={iconSizes.small} strokeWidth={2} />
      }
      tileBackground={t.tile}
      title='Streak Goal'
      valueLabel={valueLabel}
    />
  );
}
