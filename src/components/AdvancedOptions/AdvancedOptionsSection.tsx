/** AdvancedOptionsSection — always-visible list of per-habit "fine-tune" options. */
import { useState } from 'react';
import { View } from 'react-native';
import { AdvancedOptionsHeader } from './AdvancedOptionsHeader';
import { AdvancedOptionsRows } from './AdvancedOptionsRows';
import { AdvancedOptionsSheets, type SheetKey } from './AdvancedOptionsSheets';
import type { AdvancedOptionsSectionProps } from './AdvancedOptions.types';

export function AdvancedOptionsSection({
  growthType,
  strengthAlgorithm,
  progressEmojis,
  streakGoal,
  onStrengthAlgorithmChange,
  onProgressEmojisChange,
  onStreakGoalChange,
}: AdvancedOptionsSectionProps) {
  const [openSheet, setOpenSheet] = useState<SheetKey>(null);

  return (
    <>
      <View className='mt-6 px-6'>
        <AdvancedOptionsHeader growthType={growthType} />
        <AdvancedOptionsRows
          progressEmojis={progressEmojis}
          streakGoal={streakGoal}
          strengthAlgorithm={strengthAlgorithm}
          onOpen={setOpenSheet}
        />
      </View>

      <AdvancedOptionsSheets
        openSheet={openSheet}
        progressEmojis={progressEmojis}
        streakGoal={streakGoal}
        strengthAlgorithm={strengthAlgorithm}
        onClose={() => setOpenSheet(null)}
        onProgressEmojisChange={onProgressEmojisChange}
        onStreakGoalChange={onStreakGoalChange}
        onStrengthAlgorithmChange={onStrengthAlgorithmChange}
      />
    </>
  );
}
