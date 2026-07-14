/** Expanded panel body — Open Design unified mock structure. */
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { GrowthType } from '@/utils/growthTypeMeta';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { GrowthIconsInline } from './GrowthIconsInline';
import { StrengthCurveInline } from './StrengthCurveInline';
import { StreakGoalInline } from './StreakGoalInline';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  strengthAlgorithm: AlgorithmMode;
  growthType?: GrowthType;
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
}

export function AdvancedOptionsExpanded({
  strengthAlgorithm,
  growthType,
  AlgoIcon,
  onStrengthAlgorithmChange,
  streakGoal,
  onStreakGoalChange,
  progressEmojis,
  userDefaultEmojis,
  savedCustomEmojis,
  onProgressEmojisChange,
  onLayout,
}: Props) {
  const t = useAdvancedTokens();

  return (
    <View onLayout={onLayout}>
      <StrengthCurveInline
        AlgoIcon={AlgoIcon}
        growthType={growthType}
        strengthAlgorithm={strengthAlgorithm}
        onSelect={onStrengthAlgorithmChange}
      />

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: t.border,
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <StreakGoalInline
          streakGoal={streakGoal}
          onStreakGoalChange={onStreakGoalChange}
        />
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: t.border,
          paddingTop: 12,
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
