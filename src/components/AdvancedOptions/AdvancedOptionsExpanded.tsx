/** Expanded panel body — Open Design unified mock structure. */
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { GrowthType } from '@/utils/growthTypeMeta';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { GrowthIconsInline } from './GrowthIconsInline';
import { StreakGoalInline } from './StreakGoalInline';
import { StrengthCurveInline } from './StrengthCurveInline';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  strengthAlgorithm: AlgorithmMode;
  growthType?: GrowthType;
  isNewHabit: boolean;
  AlgoIcon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
  onStrengthAlgorithmChange: (mode: AlgorithmMode) => void;
  streakGoal: number;
  onStreakGoalChange: (days: number) => void;
  progressEmojis: ProgressEmojiSet | undefined;
  userDefaultEmojis: ProgressEmojiSet;
  savedCustomEmojis?: ProgressEmojiSet;
  onProgressEmojisChange: (next: ProgressEmojiSet | undefined) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  /** Scrolls the modal down when a section opens below the fold. */
  onSectionExpand?: () => void;
}

export function AdvancedOptionsExpanded({
  strengthAlgorithm,
  growthType,
  isNewHabit,
  AlgoIcon,
  onStrengthAlgorithmChange,
  streakGoal,
  onStreakGoalChange,
  progressEmojis,
  userDefaultEmojis,
  savedCustomEmojis,
  onProgressEmojisChange,
  onLayout,
  onSectionExpand,
}: Props) {
  const t = useAdvancedTokens();

  return (
    <View onLayout={onLayout}>
      <View style={{ paddingTop: 16, paddingBottom: 16 }}>
        <StreakGoalInline
          streakGoal={streakGoal}
          onStreakGoalChange={onStreakGoalChange}
        />
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: t.border,
          paddingTop: 16,
          paddingBottom: 16,
        }}
      >
        <StrengthCurveInline
          AlgoIcon={AlgoIcon}
          growthType={growthType}
          isNewHabit={isNewHabit}
          strengthAlgorithm={strengthAlgorithm}
          onExpand={onSectionExpand}
          onSelect={onStrengthAlgorithmChange}
        />
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: t.border,
          paddingTop: 16,
          paddingBottom: 16,
        }}
      >
        <GrowthIconsInline
          fallback={userDefaultEmojis}
          savedCustom={savedCustomEmojis}
          value={progressEmojis}
          onChange={onProgressEmojisChange}
        />
      </View>
    </View>
  );
}
