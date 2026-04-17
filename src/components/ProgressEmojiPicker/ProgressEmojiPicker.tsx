/**
 * ProgressEmojiPicker
 *
 * Inline picker for the 5-stage growth icon set. Expands a panel with
 * preset themes, per-slot rows, and a reset action. Each slot opens the
 * shared EmojiPickerSheet for full emoji selection.
 */
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights, typography } from '../../theme/typography';
import {
  matchPresetId,
  resolveProgressEmojis,
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiSet,
  type StrengthLevelKey,
} from '../../utils/progressEmojis';
import { EmojiPickerSheet } from '../EmojiPickerV2';

import type { ProgressEmojiPickerProps } from './ProgressEmojiPicker.types';
import { ProgressEmojiPresetRow } from './ProgressEmojiPresetRow';
import { ProgressEmojiSlotRow } from './ProgressEmojiSlotRow';

const STAGE_LABELS: Record<StrengthLevelKey, string> = {
  starting: 'Starting',
  building: 'Building',
  developing: 'Developing',
  strong: 'Strong',
  automatic: 'Automatic',
};

function ProgressEmojiPickerComponent({
  value,
  onChange,
  fallback,
  label,
}: ProgressEmojiPickerProps) {
  const { colors: themeColors } = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const [editingSlot, setEditingSlot] = useState<StrengthLevelKey | null>(null);

  const resolved: ProgressEmojiSet = useMemo(
    () => resolveProgressEmojis(value, fallback),
    [value, fallback]
  );
  const activePresetId = useMemo(() => matchPresetId(resolved), [resolved]);

  const handlePreset = useCallback(
    (next: ProgressEmojiSet) => onChange(next),
    [onChange]
  );
  const handleSlotChange = useCallback(
    (emoji: string | null) => {
      if (editingSlot && emoji) {
        onChange({ ...resolved, [editingSlot]: emoji });
      }
      setEditingSlot(null);
    },
    [editingSlot, resolved, onChange]
  );

  return (
    <View>
      {label ? (
        <Text
          className='mb-3 text-center uppercase'
          style={{
            ...typography.caption,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.5,
            color: themeColors.text.tertiary,
          }}
        >
          {label}
        </Text>
      ) : null}

      <Pressable
        accessibilityHint='Toggle growth icon customization panel'
        accessibilityLabel='Growth icons'
        accessibilityRole='button'
        accessibilityState={{ expanded }}
        className='flex-row items-center justify-between rounded-2xl px-4 py-3'
        style={{
          backgroundColor: themeColors.surface,
          borderWidth: 1,
          borderColor: themeColors.cardBorder,
          minHeight: 56,
        }}
        onPress={() => setExpanded((v) => !v)}
      >
        <View className='flex-row items-center gap-1'>
          {STRENGTH_LEVEL_KEYS.map((k) => (
            <Text key={k} style={{ fontSize: 22 }}>
              {resolved[k]}
            </Text>
          ))}
        </View>
        <Text
          style={{
            ...typography.bodySmall,
            color: themeColors.primary[600],
            fontWeight: fontWeights.semibold,
          }}
        >
          {expanded ? 'Done' : 'Customize'}
        </Text>
      </Pressable>

      {expanded ? (
        <View className='mt-3 gap-2'>
          <ProgressEmojiPresetRow
            activePresetId={activePresetId}
            onSelect={handlePreset}
          />
          {STRENGTH_LEVEL_KEYS.map((k) => (
            <ProgressEmojiSlotRow
              key={k}
              emoji={resolved[k]}
              stageKey={k}
              stageLabel={STAGE_LABELS[k]}
              onPress={setEditingSlot}
            />
          ))}
          {value === undefined ? null : (
            <Pressable
              accessibilityRole='button'
              className='mt-1 items-center py-2'
              onPress={() => onChange(fallback)}
            >
              <Text
                style={{
                  ...typography.bodySmall,
                  color: themeColors.text.tertiary,
                  fontWeight: fontWeights.medium,
                }}
              >
                Reset to default
              </Text>
            </Pressable>
          )}
        </View>
      ) : null}

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

export const ProgressEmojiPicker = memo(ProgressEmojiPickerComponent);
