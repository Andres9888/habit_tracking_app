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
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  isLocked = false,
}: EmojiPickerProps) {
  const { triggerSelection } = useHapticFeedback();
  const reduceMotion = useReduceMotion();
  const { colors: themeColors } = useThemeColors();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { suggestedEmojis, debouncedHabitName } = useSuggestedEmojis(
    habitName,
    selectedEmoji,
    { isLocked }
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
    <View className='mb-6'>
      {hideLabel ? null : <Text
          accessibilityLabel={`Suggested emojis for ${debouncedHabitName || 'your habit'}`}
          accessibilityRole='text'
          className='mb-3 text-sm font-semibold uppercase'
          style={{ letterSpacing: 0.5, color: themeColors.text.tertiary }}
        >
          {STRINGS.CREATE_HABIT.iconLabel}
        </Text>}

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
        className='mt-3 flex-row items-center justify-center'
        style={{ minHeight: 44 }}
        onPress={handleMorePress}
      >
        <Text
          className='text-sm font-medium'
          style={{ color: themeColors.primary[600] }}
        >
          Browse more emojis →
        </Text>
      </Pressable>

      {isModalVisible ? <EmojiPickerSheet
          habitName={habitName || ''}
          selectedEmoji={selectedEmoji}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelect={handleSheetSelect}
        /> : null}
    </View>
  );
}

export const EmojiPicker = memo(EmojiPickerComponent);
