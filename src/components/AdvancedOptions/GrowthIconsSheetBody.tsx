/** GrowthIconsSheetBody — preset picker + per-stage rows inside an AdvancedSheet. */
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ProgressEmojiPresetRow } from '@/components/ProgressEmojiPicker/ProgressEmojiPresetRow';
import { EmojiPickerSheet } from '@/components/EmojiPickerV2';
import { useUserCustomProgressEmojis } from '@/hooks/useProgressEmojis';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  resolveProgressEmojis,
  type ProgressEmojiPreset,
  type ProgressEmojiSet,
  type StrengthLevelKey,
} from '@/utils/progressEmojis';
import { GrowthIconsSheetSlots } from './GrowthIconsSheetSlots';

interface Props {
  value: ProgressEmojiSet | undefined;
  fallback: ProgressEmojiSet;
  onChange: (next?: ProgressEmojiSet) => void;
  showPresets?: boolean;
}

export function GrowthIconsSheetBody({
  value,
  fallback,
  onChange,
  showPresets = true,
}: Props) {
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
        {showPresets ? (
          <ProgressEmojiPresetRow
            activePresetId={activePresetId}
            customPreset={customPreset}
            onSelect={(next) => onChange(next)}
          />
        ) : null}
        <GrowthIconsSheetSlots
          hasOverride={value !== undefined}
          resolved={resolved}
          onEditSlot={setEditingSlot}
          onReset={() => {
            onChange();
          }}
        />
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
