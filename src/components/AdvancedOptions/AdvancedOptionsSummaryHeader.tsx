/** Collapsed "More to customize" summary — preview chips + Customize/Hide toggle. */
import { Pressable, Text, View } from 'react-native';
import { Target } from 'lucide-react-native';
import { ALGORITHM_COPY } from '@/components/AlgorithmPicker';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
import { AdvancedOptionsPreviewChip } from './AdvancedOptionsPreviewChip';
import { AdvancedOptionsToggleButton } from './AdvancedOptionsToggleButton';

interface Props {
  strengthAlgorithm: AlgorithmMode;
  presetLabel: string;
  resolvedStarting: string;
  streakGoal: number;
  expanded: boolean;
  chevronAnimatedStyle: object;
  onToggle: () => void;
}

export function AdvancedOptionsSummaryHeader({
  strengthAlgorithm,
  presetLabel,
  resolvedStarting,
  streakGoal,
  expanded,
  chevronAnimatedStyle,
  onToggle,
}: Props) {
  const { colors } = useThemeColors();
  const algoEntry = ALGORITHM_COPY[strengthAlgorithm];
  const algoStyle = MODE_STYLES[strengthAlgorithm];
  const AlgoIcon = algoStyle.Icon;

  return (
    <Pressable
      accessibilityLabel='More to customize, 3 options'
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
      <View className='mt-3 flex-row flex-wrap justify-center gap-2'>
        <AdvancedOptionsPreviewChip
          backgroundColor={colors.status.streakLight}
          foregroundColor={colors.status.streakText}
          icon={
            <Target
              color={colors.status.streakText}
              size={12}
              strokeWidth={2.5}
            />
          }
          label={streakGoal > 0 ? `${streakGoal}-day` : 'No goal set'}
        />
        <AdvancedOptionsPreviewChip
          backgroundColor={colors.primary[100]}
          foregroundColor={colors.primary[700]}
          icon={<Text style={{ fontSize: 12 }}>{resolvedStarting}</Text>}
          label={presetLabel}
        />
        <AdvancedOptionsPreviewChip
          backgroundColor={algoStyle.iconTileBackground}
          foregroundColor={algoStyle.iconColor}
          icon={
            <AlgoIcon color={algoStyle.iconColor} size={12} strokeWidth={2.5} />
          }
          label={algoEntry.name}
        />
      </View>
      <AdvancedOptionsToggleButton
        chevronAnimatedStyle={chevronAnimatedStyle}
        expanded={expanded}
      />
    </Pressable>
  );
}
