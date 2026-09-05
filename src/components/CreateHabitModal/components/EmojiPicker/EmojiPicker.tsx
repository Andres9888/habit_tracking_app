/**
 * EmojiPicker Component
 * Suggested emojis in the legacy 5-4 triangle layout, or (layout='grid') the
 * 5-column square-tile grid with a dashed "+" tile.
 */

import { memo, useCallback, useState } from 'react';
import { AccessibilityInfo, Keyboard, Text, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { useReducedMotion } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import STRINGS from '../../../../constants/strings';
import { BrowseMoreLink } from './BrowseMoreLink';
import { EmojiBrowseSheet } from './EmojiBrowseSheet';
import { EmojiGrid } from './EmojiGrid';
import { EmojiTileGrid } from './EmojiTileGrid';
import { useSuggestedEmojis } from './useSuggestedEmojis';
import type { EmojiPickerProps } from './types';

function EmojiPickerComponent({
  selectedEmoji,
  onSelect,
  habitName,
  hideLabel = false,
  isLocked = false,
  layout = 'triangle',
  onBrowse,
}: EmojiPickerProps) {
  const { triggerSelection } = useHapticFeedback();
  const reduceMotion = useReducedMotion();
  const { colors: themeColors } = useThemeColors();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { suggestedEmojis, debouncedHabitName } = useSuggestedEmojis(
    habitName,
    selectedEmoji,
    { isLocked }
  );
  const isGrid = layout === 'grid';

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
    if (onBrowse) {
      onBrowse();
      return;
    }
    Keyboard.dismiss();
    triggerSelection();
    setIsModalVisible(true);
  }, [onBrowse, triggerSelection]);

  return (
    <View className={isGrid ? undefined : 'mb-6'}>
      {hideLabel || isGrid ? null : (
        <Text
          accessibilityLabel={`Suggested emojis for ${debouncedHabitName || 'your habit'}`}
          accessibilityRole='text'
          className='mb-3 text-sm font-semibold uppercase'
          style={{ letterSpacing: 0.5, color: themeColors.text.tertiary }}
        >
          {STRINGS.CREATE_HABIT.iconLabel}
        </Text>
      )}

      {isGrid ? (
        <EmojiTileGrid
          reduceMotion={reduceMotion}
          selectedEmoji={selectedEmoji}
          suggestedEmojis={suggestedEmojis}
          onBrowse={handleMorePress}
          onEmojiSelect={handleEmojiSelect}
        />
      ) : (
        <EmojiGrid
          reduceMotion={reduceMotion}
          selectedEmoji={selectedEmoji}
          suggestedEmojis={suggestedEmojis}
          onEmojiSelect={handleEmojiSelect}
        />
      )}

      {isGrid ? null : <BrowseMoreLink onPress={handleMorePress} />}

      <EmojiBrowseSheet
        habitName={habitName}
        selectedEmoji={selectedEmoji}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={onSelect}
      />
    </View>
  );
}

export const EmojiPicker = memo(EmojiPickerComponent);
