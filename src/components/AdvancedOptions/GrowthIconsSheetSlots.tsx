/** Per-stage emoji slot list + reset control for Growth Icons sheet. */
import { Pressable, Text, View } from 'react-native';
import { ProgressEmojiSlotRow } from '@/components/ProgressEmojiPicker/ProgressEmojiSlotRow';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import {
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiSet,
  type StrengthLevelKey,
} from '@/utils/progressEmojis';

const STAGE_LABELS: Record<StrengthLevelKey, string> = {
  starting: 'Starting',
  building: 'Building',
  developing: 'Developing',
  strong: 'Strong',
  automatic: 'Automatic',
};

interface Props {
  resolved: ProgressEmojiSet;
  hasOverride: boolean;
  onEditSlot: (key: StrengthLevelKey) => void;
  onReset: () => void;
}

export function GrowthIconsSheetSlots({
  resolved,
  hasOverride,
  onEditSlot,
  onReset,
}: Props) {
  const { colors } = useThemeColors();
  return (
    <>
      <View className='mt-2 gap-2'>
        {STRENGTH_LEVEL_KEYS.map((k) => (
          <ProgressEmojiSlotRow
            key={k}
            emoji={resolved[k]}
            stageKey={k}
            stageLabel={STAGE_LABELS[k]}
            onPress={onEditSlot}
          />
        ))}
      </View>
      {hasOverride ? (
        <Pressable
          accessibilityRole='button'
          className='mt-3 items-center py-2'
          onPress={onReset}
        >
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.text.tertiary,
              fontWeight: fontWeights.medium,
            }}
          >
            Reset to default
          </Text>
        </Pressable>
      ) : null}
    </>
  );
}
