/** Expanded panel body — Open Design unified mock structure. */
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { GrowthType } from '@/utils/growthTypeMeta';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { AdvancedOptionsRow } from './AdvancedOptionsRow';
import { GrowthIconsInline } from './GrowthIconsInline';
import { StreakGoalInline } from './StreakGoalInline';
import { StrengthCurveInline } from './StrengthCurveInline';
import { WhyInline } from './WhyInline';

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
  why?: string;
  /** Presence of this handler is what enables the Your why row. */
  onWhyChange?: (text: string) => void;
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
  why,
  onWhyChange,
}: Props) {
  return (
    <View onLayout={onLayout}>
      {onWhyChange ? (
        <AdvancedOptionsRow divided={false}>
          <WhyInline why={why ?? ''} onWhyChange={onWhyChange} />
        </AdvancedOptionsRow>
      ) : null}

      <AdvancedOptionsRow divided={Boolean(onWhyChange)}>
        <StreakGoalInline
          streakGoal={streakGoal}
          onStreakGoalChange={onStreakGoalChange}
        />
      </AdvancedOptionsRow>

      <AdvancedOptionsRow>
        <StrengthCurveInline
          AlgoIcon={AlgoIcon}
          growthType={growthType}
          isNewHabit={isNewHabit}
          strengthAlgorithm={strengthAlgorithm}
          onExpand={onSectionExpand}
          onSelect={onStrengthAlgorithmChange}
        />
      </AdvancedOptionsRow>

      <AdvancedOptionsRow>
        <GrowthIconsInline
          fallback={userDefaultEmojis}
          savedCustom={savedCustomEmojis}
          value={progressEmojis}
          onChange={onProgressEmojisChange}
        />
      </AdvancedOptionsRow>
    </View>
  );
}
