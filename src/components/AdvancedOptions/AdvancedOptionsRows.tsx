/** The three always-visible "fine-tune" rows (strength / icons / streak) inside one card. */
import { Text, View } from 'react-native';
import { Target } from 'lucide-react-native';
import {
  DEFAULT_ALGORITHM,
  type AlgorithmMode,
} from '@/components/AlgorithmPicker';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { shadows } from '@/theme/spacing';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { AdvancedOptionRow } from './AdvancedOptionRow';
import { useAdvancedRowSummary } from './useAdvancedRowSummary';
import type { SheetKey } from './AdvancedOptionsSheets';

interface AdvancedOptionsRowsProps {
  strengthAlgorithm: AlgorithmMode;
  progressEmojis: ProgressEmojiSet | undefined;
  streakGoal: number;
  onOpen: (sheet: SheetKey) => void;
}

// eslint-disable-next-line max-lines-per-function
export function AdvancedOptionsRows({
  strengthAlgorithm,
  progressEmojis,
  streakGoal,
  onOpen,
}: AdvancedOptionsRowsProps) {
  const { colors } = useThemeColors();
  const { algoEntry, AlgoIcon, resolvedEmojis, presetLabel, hasGoal } =
    useAdvancedRowSummary(strengthAlgorithm, progressEmojis, streakGoal);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderRadius: 16,
        paddingHorizontal: 8,
        ...shadows.subtle,
      }}
    >
      <AdvancedOptionRow
        isFirst
        accessibilityHint='Opens strength curve picker'
        description='Steady, research-backed pace. Missing a day sets you back a little.'
        icon={
          <AlgoIcon
            color={colors.primary[700]}
            size={iconSizes.small}
            strokeWidth={2}
          />
        }
        iconBackground={colors.surface}
        subtitle={`${algoEntry.name} · ~${algoEntry.daysToForm}-day build`}
        title='How fast it builds'
        titleBadge={
          strengthAlgorithm === DEFAULT_ALGORITHM ? 'Recommended' : undefined
        }
        onPress={() => onOpen('algorithm')}
      />
      <AdvancedOptionRow
        accessibilityHint='Opens growth icons picker'
        description='The 5 emojis that mark your habit getting stronger.'
        icon={<Text style={{ fontSize: 18 }}>{resolvedEmojis.starting}</Text>}
        iconBackground={colors.surface}
        subtitle={`${presetLabel} · 5 stages`}
        title='Progress icons'
        onPress={() => onOpen('growth')}
      />
      <AdvancedOptionRow
        accessibilityHint='Opens streak goal picker'
        description='An optional number to aim for — no penalty if you miss.'
        icon={
          <Target
            color={hasGoal ? colors.status.streakText : colors.primary[700]}
            size={iconSizes.small}
            strokeWidth={2}
          />
        }
        iconBackground={hasGoal ? colors.status.streakLight : colors.surface}
        subtitle={hasGoal ? `${streakGoal}-day goal` : 'No goal set'}
        title='Streak target'
        onPress={() => onOpen('streak')}
      />
    </View>
  );
}
