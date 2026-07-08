/** The bottom sheets + full strength-curve picker opened from the advanced rows. */
import { useState } from 'react';
import { View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useUserDefaultProgressEmojis } from '@/hooks/useProgressEmojis';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { StrengthCurvePickerModal } from '@/screens/StrengthCurvePicker';
import { AdvancedSheet } from './AdvancedSheet';
import { GrowthIconsSheetBody } from './GrowthIconsSheetBody';
import { StreakGoalSheetBody } from './StreakGoalSheetBody';
import { StrengthCurveSheetBody } from './StrengthCurveSheetBody';

export type SheetKey = 'algorithm' | 'growth' | 'streak' | null;

interface AdvancedOptionsSheetsProps {
  openSheet: SheetKey;
  onClose: () => void;
  strengthAlgorithm: AlgorithmMode;
  progressEmojis: ProgressEmojiSet | undefined;
  streakGoal: number;
  onStrengthAlgorithmChange: (mode: AlgorithmMode) => void;
  onProgressEmojisChange: (next: ProgressEmojiSet | undefined) => void;
  onStreakGoalChange: (days: number) => void;
}

// eslint-disable-next-line max-lines-per-function
export function AdvancedOptionsSheets({
  openSheet,
  onClose,
  strengthAlgorithm,
  progressEmojis,
  streakGoal,
  onStrengthAlgorithmChange,
  onProgressEmojisChange,
  onStreakGoalChange,
}: AdvancedOptionsSheetsProps) {
  const userDefaultEmojis = useUserDefaultProgressEmojis();
  const [fullPickerVisible, setFullPickerVisible] = useState(false);

  const openFullPicker = () => {
    onClose();
    setTimeout(() => setFullPickerVisible(true), 80);
  };

  return (
    <>
      <StrengthCurvePickerModal
        selected={strengthAlgorithm}
        visible={fullPickerVisible}
        onClose={() => setFullPickerVisible(false)}
        onSelect={onStrengthAlgorithmChange}
      />

      <AdvancedSheet
        subtitle='How strength grows — and what a missed day costs.'
        title='Strength Curve'
        visible={openSheet === 'algorithm'}
        onClose={onClose}
      >
        <StrengthCurveSheetBody
          selected={strengthAlgorithm}
          onLearnMore={openFullPicker}
          onSelect={onStrengthAlgorithmChange}
        />
      </AdvancedSheet>

      <AdvancedSheet
        subtitle='Five stages, one for every 20% of strength. Pick a theme or customize any stage.'
        title='Growth Icons'
        visible={openSheet === 'growth'}
        onClose={onClose}
      >
        <View style={{ maxHeight: 520 }}>
          <GrowthIconsSheetBody
            fallback={userDefaultEmojis}
            value={progressEmojis}
            onChange={onProgressEmojisChange}
          />
        </View>
      </AdvancedSheet>

      <AdvancedSheet
        subtitle='Set a streak length to aim for.'
        title='Streak Goal'
        visible={openSheet === 'streak'}
        onClose={onClose}
      >
        <StreakGoalSheetBody
          streakGoal={streakGoal}
          onStreakGoalChange={onStreakGoalChange}
        />
      </AdvancedSheet>
    </>
  );
}
