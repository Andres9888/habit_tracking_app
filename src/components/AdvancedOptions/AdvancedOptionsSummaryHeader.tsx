/** Collapsed "More to customize" summary — preview chips + Customize/Hide toggle. */
import { Pressable, Text, View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { AdvancedOptionsSummaryChips } from './AdvancedOptionsSummaryChips';
import { AdvancedOptionsToggleButton } from './AdvancedOptionsToggleButton';

interface Props {
  strengthAlgorithm: AlgorithmMode;
  presetLabel: string;
  resolvedStarting: string;
  streakGoal: number;
  expanded: boolean;
  chevronAnimatedStyle: object;
  onToggle: () => void;
  why?: string;
  /** True when the Your why row is rendered in the expanded panel. */
  whyEnabled?: boolean;
}

export function AdvancedOptionsSummaryHeader({
  strengthAlgorithm,
  presetLabel,
  resolvedStarting,
  streakGoal,
  expanded,
  chevronAnimatedStyle,
  onToggle,
  why,
  whyEnabled = false,
}: Props) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={`More to customize, ${whyEnabled ? 4 : 3} options`}
      accessibilityRole='button'
      accessibilityState={{ expanded }}
      className='px-4 py-3.5'
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      onPress={onToggle}
    >
      <View className='items-center'>
        <Text
          className='uppercase'
          style={{
            ...typography.caption,
            fontSize: 12,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.5,
            color: colors.text.secondary,
          }}
        >
          More to customize
        </Text>
      </View>
      <AdvancedOptionsSummaryChips
        presetLabel={presetLabel}
        resolvedStarting={resolvedStarting}
        streakGoal={streakGoal}
        strengthAlgorithm={strengthAlgorithm}
        why={why}
        whyEnabled={whyEnabled}
      />
      <AdvancedOptionsToggleButton
        chevronAnimatedStyle={chevronAnimatedStyle}
        expanded={expanded}
      />
    </Pressable>
  );
}
