/** Derives the display summary (labels, icon, preset) for the advanced option rows. */
import {
  ALGORITHM_COPY,
  type AlgorithmMode,
} from '@/components/AlgorithmPicker';
import {
  useUserCustomProgressEmojis,
  useUserDefaultProgressEmojis,
} from '@/hooks/useProgressEmojis';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  PROGRESS_EMOJI_PRESETS,
  resolveProgressEmojis,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';

export function useAdvancedRowSummary(
  strengthAlgorithm: AlgorithmMode,
  progressEmojis: ProgressEmojiSet | undefined,
  streakGoal: number
) {
  const userDefaultEmojis = useUserDefaultProgressEmojis();
  const savedCustomEmojis = useUserCustomProgressEmojis();

  const resolvedEmojis = resolveProgressEmojis(
    progressEmojis,
    userDefaultEmojis
  );
  const presetId = matchPresetId(resolvedEmojis, savedCustomEmojis);
  const presetLabel =
    presetId === CUSTOM_PRESET_ID
      ? 'Custom'
      : (PROGRESS_EMOJI_PRESETS.find((p) => p.id === presetId)?.label ??
        'Custom');

  return {
    algoEntry: ALGORITHM_COPY[strengthAlgorithm],
    AlgoIcon: MODE_STYLES[strengthAlgorithm].Icon,
    resolvedEmojis,
    presetLabel,
    hasGoal: streakGoal > 0,
  };
}
