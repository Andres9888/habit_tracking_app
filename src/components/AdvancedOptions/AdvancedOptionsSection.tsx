/**
 * AdvancedOptionsSection — Advanced Options panel (theme-aware).
 * Raised card + measured spring/timing accordion, matching app conventions.
 */
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  useUserCustomProgressEmojis,
  useUserDefaultProgressEmojis,
} from '@/hooks/useProgressEmojis';
import { shadows } from '@/theme';
import { durations } from '@/theme/animations';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
import { AdvancedOptionsCurveSheet } from './AdvancedOptionsCurveSheet';
import { AdvancedOptionsExpanded } from './AdvancedOptionsExpanded';
import { AdvancedOptionsSectionLabel } from './AdvancedOptionsSectionLabel';
import { useAdvancedOptionsAccordion } from './useAdvancedOptionsAccordion';
import { useAdvancedTokens } from './useAdvancedTokens';
import type { AdvancedOptionsSectionProps } from './AdvancedOptions.types';

export function AdvancedOptionsSection({
  strengthAlgorithm,
  progressEmojis,
  streakGoal,
  onStrengthAlgorithmChange,
  onProgressEmojisChange,
  onStreakGoalChange,
  onExpand,
}: AdvancedOptionsSectionProps) {
  const userDefaultEmojis = useUserDefaultProgressEmojis();
  const savedCustomEmojis = useUserCustomProgressEmojis();
  const t = useAdvancedTokens();
  const [expanded, setExpanded] = useState(true);
  const [curveSheetOpen, setCurveSheetOpen] = useState(false);
  const [fullPickerVisible, setFullPickerVisible] = useState(false);
  const { chevronAnimatedStyle, contentAnimatedStyle, handleContentLayout } =
    useAdvancedOptionsAccordion({ isExpanded: expanded });

  const onExpandRef = useRef(onExpand);
  useEffect(() => {
    onExpandRef.current = onExpand;
  });
  useEffect(() => {
    if (!expanded) return;
    const id = setTimeout(() => onExpandRef.current?.(), durations.enter);
    return () => clearTimeout(id);
  }, [expanded]);

  const AlgoIcon = MODE_STYLES[strengthAlgorithm].Icon;

  return (
    <>
      <View style={{ marginTop: 24, paddingHorizontal: 24 }}>
        <AdvancedOptionsSectionLabel
          chevronAnimatedStyle={chevronAnimatedStyle}
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
        />
        <Animated.View style={contentAnimatedStyle}>
          <View
            style={{
              backgroundColor: t.card,
              borderWidth: 1,
              borderColor: t.border,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingBottom: 12,
              ...shadows.card,
            }}
            onLayout={handleContentLayout}
          >
            <AdvancedOptionsExpanded
              AlgoIcon={AlgoIcon}
              progressEmojis={progressEmojis}
              savedCustomEmojis={savedCustomEmojis}
              strengthAlgorithm={strengthAlgorithm}
              streakGoal={streakGoal}
              userDefaultEmojis={userDefaultEmojis}
              onOpenCurve={() => setCurveSheetOpen(true)}
              onProgressEmojisChange={onProgressEmojisChange}
              onStreakGoalChange={onStreakGoalChange}
            />
          </View>
        </Animated.View>
      </View>
      <AdvancedOptionsCurveSheet
        curveSheetOpen={curveSheetOpen}
        fullPickerVisible={fullPickerVisible}
        strengthAlgorithm={strengthAlgorithm}
        onCloseCurve={() => setCurveSheetOpen(false)}
        onCloseFull={() => setFullPickerVisible(false)}
        onOpenFull={() => setFullPickerVisible(true)}
        onStrengthAlgorithmChange={onStrengthAlgorithmChange}
      />
    </>
  );
}
