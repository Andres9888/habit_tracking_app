/** GrowthIconsSheetBody — preset picker + per-stage rows inside an AdvancedSheet. */
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ProgressEmojiPresetRow } from '@/components/ProgressEmojiPicker/ProgressEmojiPresetRow';
import { ProgressEmojiSlotRow } from '@/components/ProgressEmojiPicker/ProgressEmojiSlotRow';
import { EmojiPickerSheet } from '@/components/EmojiPickerV2';
import { useUserCustomProgressEmojis } from '@/hooks/useProgressEmojis';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  resolveProgressEmojis,
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiPreset,
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
  value: ProgressEmojiSet | undefined;
  fallback: ProgressEmojiSet;
  onChange: (next: ProgressEmojiSet | undefined) => void;
}

export function GrowthIconsSheetBody({ value, fallback, onChange }: Props) {
  const { colors } = useThemeColors();
  const [editingSlot, setEditingSlot] = useState<StrengthLevelKey | null>(null);
  const savedCustom = useUserCustomProgressEmojis();
  const resolved = useMemo(
    () => resolveProgressEmojis(value, fallback),
    [value, fallback]
  );
  const activePresetId = useMemo(
    () => matchPresetId(resolved, savedCustom),
    [resolved, savedCustom]
  );
  const customPreset = useMemo<ProgressEmojiPreset | null>(
    () =>
      savedCustom
        ? { id: CUSTOM_PRESET_ID, label: 'Custom', emojis: savedCustom }
        : null,
    [savedCustom]
  );

  const handleSlotChange = useCallback(
    (emoji: string | null) => {
      if (editingSlot && emoji) onChange({ ...resolved, [editingSlot]: emoji });
      setEditingSlot(null);
    },
    [editingSlot, resolved, onChange]
  );

  return (
    <View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      >
        <ProgressEmojiPresetRow
          activePresetId={activePresetId}
          customPreset={customPreset}
          onSelect={(next) => onChange(next)}
        />
        <View className='mt-2 gap-2'>
          {STRENGTH_LEVEL_KEYS.map((k) => (
            <ProgressEmojiSlotRow
              key={k}
              emoji={resolved[k]}
              stageKey={k}
              stageLabel={STAGE_LABELS[k]}
              onPress={setEditingSlot}
            />
          ))}
        </View>
        {value === undefined ? null : (
          <Pressable
            accessibilityRole='button'
            className='mt-3 items-center py-2'
            onPress={() => onChange(undefined)}
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
        )}
      </ScrollView>
      {editingSlot ? (
        <EmojiPickerSheet
          habitName=''
          selectedEmoji={resolved[editingSlot]}
          visible={editingSlot !== null}
          onClose={() => setEditingSlot(null)}
          onSelect={handleSlotChange}
        />
      ) : null}
    </View>
  );
}
