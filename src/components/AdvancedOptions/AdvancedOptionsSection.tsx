/** AdvancedOptionsSection — consolidated per-habit Advanced controls. */
import { useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
import { useAdvancedOptionsAccordion } from './useAdvancedOptionsAccordion';
import { useAdvancedOptionsSummary } from './useAdvancedOptionsSummary';
import { useScrollOnExpand } from './useScrollOnExpand';
import { AdvancedOptionsExpanded } from './AdvancedOptionsExpanded';
import { AdvancedOptionsSummaryHeader } from './AdvancedOptionsSummaryHeader';
import type { AdvancedOptionsSectionProps } from './AdvancedOptions.types';

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
}: AdvancedOptionsSectionProps) {
  const { colors } = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const {
    chevronAnimatedStyle,
    contentAnimatedStyle,
    handleContentLayout,
    reduceMotion,
  } = useAdvancedOptionsAccordion({ isExpanded: expanded });
  useScrollOnExpand(expanded, reduceMotion, onExpand);

  const { userDefaultEmojis, savedCustomEmojis, resolvedEmojis, presetLabel } =
    useAdvancedOptionsSummary(progressEmojis);
  const AlgoIcon = MODE_STYLES[strengthAlgorithm].Icon;

  return (
    <View className='mt-6 px-6'>
      <View
        style={{
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          borderRadius: 16,
          ...shadows.subtle,
        }}
      >
        <AdvancedOptionsSummaryHeader
          chevronAnimatedStyle={chevronAnimatedStyle}
          expanded={expanded}
          presetLabel={presetLabel}
          resolvedStarting={resolvedEmojis.starting}
          streakGoal={streakGoal}
          strengthAlgorithm={strengthAlgorithm}
          onToggle={() => {
            void triggerHaptic('selection');
            setExpanded((v) => !v);
          }}
        />
        <Animated.View
          accessibilityElementsHidden={!expanded}
          importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
          pointerEvents={expanded ? 'auto' : 'none'}
          style={contentAnimatedStyle}
        >
          <View className='px-4 pb-3 pt-1' onLayout={handleContentLayout}>
            <AdvancedOptionsExpanded
              AlgoIcon={AlgoIcon}
              growthType={growthType}
              isNewHabit={isNewHabit}
              progressEmojis={progressEmojis}
              savedCustomEmojis={savedCustomEmojis}
              strengthAlgorithm={strengthAlgorithm}
              streakGoal={streakGoal}
              userDefaultEmojis={userDefaultEmojis}
              onProgressEmojisChange={onProgressEmojisChange}
              onSectionExpand={onExpand}
              onStreakGoalChange={onStreakGoalChange}
              onStrengthAlgorithmChange={onStrengthAlgorithmChange}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
