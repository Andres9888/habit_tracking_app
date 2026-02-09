/**
 * EmojiPicker Component
 * Displays suggested emojis in 5-4 triangle layout with full picker modal
 */

import { memo, useCallback, useState } from 'react';
import {
  AccessibilityInfo,
  Keyboard,
  Pressable,
  Text,
  View,
} from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import STRINGS from '../../../../constants/strings';
import { EmojiPickerSheet } from '../../../EmojiPickerV2';
import { EmojiGrid } from './EmojiGrid';
import { useSuggestedEmojis } from './useSuggestedEmojis';
import type { EmojiPickerProps } from './types';

function EmojiPickerComponent({
  selectedEmoji,
  onSelect,
  habitName,
  hideLabel = false,
}: EmojiPickerProps) {
  const { triggerSelection } = useHapticFeedback();
  const reduceMotion = useReduceMotion();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { suggestedEmojis, debouncedHabitName } = useSuggestedEmojis(
    habitName,
    selectedEmoji
  );

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      Keyboard.dismiss();
      triggerSelection();
      onSelect(emoji);
      AccessibilityInfo.announceForAccessibility(`Selected emoji ${emoji}`);
    },
    [onSelect, triggerSelection]
  );

  const handleMorePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    setIsModalVisible(true);
  }, [triggerSelection]);

  const handleSheetSelect = useCallback(
    (emoji: string | null) => {
      onSelect(emoji);
      triggerSelection();
    },
    [onSelect, triggerSelection]
  );

  return (
    <View className='mb-4'>
      {!hideLabel && (
        <Text
          accessibilityLabel={`Suggested emojis for ${debouncedHabitName || 'your habit'}`}
          accessibilityRole='text'
          className='mb-3 text-[13px] font-semibold uppercase text-stone-500'
          style={{ letterSpacing: 0.5 }}
        >
          {STRINGS.CREATE_HABIT.iconLabel}
        </Text>
      )}

      <EmojiGrid
        reduceMotion={reduceMotion}
        selectedEmoji={selectedEmoji}
        suggestedEmojis={suggestedEmojis}
        onEmojiSelect={handleEmojiSelect}
      />

      <Pressable
        accessibilityHint='Opens full emoji picker with hundreds of options'
        accessibilityLabel='Browse more emojis'
        accessibilityRole='button'
        className='mt-2 flex-row items-center justify-center py-1'
        onPress={handleMorePress}
      >
        <Text className='text-sm font-medium text-emerald-600'>
          Browse more emojis
        </Text>
        <Text className='ml-1 text-emerald-600'>→</Text>
      </Pressable>

      <EmojiPickerSheet
        habitName={habitName || ''}
        selectedEmoji={selectedEmoji}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handleSheetSelect}
      />
    </View>
  );
}

export const EmojiPicker = memo(EmojiPickerComponent);
