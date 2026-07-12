/** Expanded panel body — Open Design unified mock structure. */
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { iconSizes } from '@/theme/iconSizes';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { AdvancedOptionRow } from './AdvancedOptionRow';
import { StreakGoalInline } from './StreakGoalInline';
import { GrowthIconsInline } from './GrowthIconsInline';
import { CURVE_MOCK_COPY } from './mockTokens';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  strengthAlgorithm: AlgorithmMode;
  AlgoIcon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
  onOpenCurve: () => void;
  streakGoal: number;
  onStreakGoalChange: (days: number) => void;
  progressEmojis: ProgressEmojiSet | undefined;
  userDefaultEmojis: ProgressEmojiSet;
  savedCustomEmojis?: ProgressEmojiSet;
  onProgressEmojisChange: (next: ProgressEmojiSet | undefined) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
}

export function AdvancedOptionsExpanded({
  strengthAlgorithm,
  AlgoIcon,
  onOpenCurve,
  streakGoal,
  onStreakGoalChange,
  progressEmojis,
  userDefaultEmojis,
  savedCustomEmojis,
  onProgressEmojisChange,
  onLayout,
}: Props) {
  const curve = CURVE_MOCK_COPY[strengthAlgorithm];
  const t = useAdvancedTokens();

  return (
    <View onLayout={onLayout}>
      <AdvancedOptionRow
        accessibilityHint='Opens strength curve picker'
        icon={
          <AlgoIcon
            color={t.accentTileIcon}
            size={iconSizes.small}
            strokeWidth={2}
          />
        }
        iconBackground={t.accentTile}
        subtitle={`${curve.name} · ${curve.short}`}
        title='Strength Curve'
        onPress={onOpenCurve}
      />

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: t.border,
          paddingTop: 16,
          paddingBottom: 16,
        }}
      >
        <StreakGoalInline
          streakGoal={streakGoal}
          onStreakGoalChange={onStreakGoalChange}
        />
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: t.border,
          paddingTop: 16,
        }}
      >
        <GrowthIconsInline
          fallback={userDefaultEmojis}
          savedCustom={savedCustomEmojis}
          value={progressEmojis}
          onChange={onProgressEmojisChange}
        />
      </View>
    </View>
  );
}
