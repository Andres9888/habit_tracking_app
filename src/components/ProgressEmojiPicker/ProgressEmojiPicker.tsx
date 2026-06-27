/**
 * ProgressEmojiPicker
 *
 * Inline picker for the 5-stage growth icon set. A header row previews the set
 * and toggles an animated panel of preset themes, per-slot rows, and a reset
 * action. Each slot opens the shared EmojiPickerSheet for full emoji selection.
 */
import { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';

import {
  matchPresetId,
  resolveProgressEmojis,
  type ProgressEmojiSet,
  type StrengthLevelKey,
} from '../../utils/progressEmojis';
import { EmojiPickerSheet } from '../EmojiPickerV2';

import { useProgressPickerAnimation } from './ProgressEmojiPicker.hooks';
import type { ProgressEmojiPickerProps } from './ProgressEmojiPicker.types';
import { ProgressEmojiPanel } from './ProgressEmojiPanel';
import { ProgressEmojiToggleRow } from './ProgressEmojiToggleRow';

function ProgressEmojiPickerComponent({
  value,
  onChange,
  fallback,
  toggleRowStyle,
  expandedPanelStyle,
  customPreset,
  expanded: controlledExpanded,
  onToggleExpanded,
}: ProgressEmojiPickerProps) {
  const reduceMotion = useReduceMotion();
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded ?? internalExpanded;
  const toggleExpanded =
    onToggleExpanded ?? (() => setInternalExpanded((v) => !v));
  const [editingSlot, setEditingSlot] = useState<StrengthLevelKey | null>(null);
  const { animatedStyle, handleLayout } = useProgressPickerAnimation(
    expanded,
    reduceMotion
  );

  const resolved: ProgressEmojiSet = useMemo(
    () => resolveProgressEmojis(value, fallback),
    [value, fallback]
  );
  const activePresetId = useMemo(
    () => matchPresetId(resolved, customPreset?.emojis),
    [resolved, customPreset]
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
      <ProgressEmojiToggleRow
        expanded={expanded}
        resolved={resolved}
        toggleRowStyle={toggleRowStyle}
        onToggle={toggleExpanded}
      />

      <Animated.View
        accessibilityElementsHidden={!expanded}
        importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
        pointerEvents={expanded ? 'auto' : 'none'}
        style={animatedStyle}
      >
        <ProgressEmojiPanel
          activePresetId={activePresetId}
          customPreset={customPreset}
          panelStyle={expandedPanelStyle}
          resolved={resolved}
          showReset={value !== undefined}
          onLayout={handleLayout}
          onPreset={onChange}
          onReset={() => onChange(fallback)}
          onSlotPress={setEditingSlot}
        />
      </Animated.View>

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
