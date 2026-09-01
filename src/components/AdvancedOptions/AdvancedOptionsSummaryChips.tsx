/** The collapsed summary's preview pills — one per customizable option. */
import { Quote, Target } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { ALGORITHM_COPY } from '@/components/AlgorithmPicker';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { colors as palette } from '@/theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
import { AdvancedOptionsPreviewChip } from './AdvancedOptionsPreviewChip';

interface Props {
  strengthAlgorithm: AlgorithmMode;
  presetLabel: string;
  resolvedStarting: string;
  streakGoal: number;
  why?: string;
  whyEnabled: boolean;
}

export function AdvancedOptionsSummaryChips({
  strengthAlgorithm,
  presetLabel,
  resolvedStarting,
  streakGoal,
  why,
  whyEnabled,
}: Props) {
  const { colors } = useThemeColors();
  const algoStyle = MODE_STYLES[strengthAlgorithm];
  const AlgoIcon = algoStyle.Icon;

  return (
    <View className='mt-3 flex-row flex-wrap justify-center gap-2'>
      {whyEnabled ? (
        <AdvancedOptionsPreviewChip
          backgroundColor={palette.parchment.bg}
          foregroundColor={palette.parchment.text}
          icon={
            <Quote color={palette.parchment.text} size={12} strokeWidth={2.5} />
          }
          label={(why ?? '').trim().length > 0 ? 'Why set' : 'Add a why'}
        />
      ) : null}
      <AdvancedOptionsPreviewChip
        backgroundColor={colors.status.streakLight}
        foregroundColor={colors.status.streakText}
        icon={
          <Target color={colors.status.streakText} size={12} strokeWidth={2.5} />
        }
        label={streakGoal > 0 ? `${streakGoal}-day` : 'No goal set'}
      />
      <AdvancedOptionsPreviewChip
        backgroundColor={algoStyle.iconTileBackground}
        foregroundColor={algoStyle.iconColor}
        icon={
          <AlgoIcon color={algoStyle.iconColor} size={12} strokeWidth={2.5} />
        }
        label={ALGORITHM_COPY[strengthAlgorithm].name}
      />
      <AdvancedOptionsPreviewChip
        backgroundColor={colors.primary[100]}
        foregroundColor={colors.primary[700]}
        icon={<Text style={{ fontSize: 12 }}>{resolvedStarting}</Text>}
        label={presetLabel}
      />
    </View>
  );
}
