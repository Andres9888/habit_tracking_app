/**
 * EmojiPickerSheet Component
 * Main orchestrator for the emoji picker bottom sheet
 */

import React, { memo, useCallback, useMemo } from 'react';
import { Modal, View, Pressable } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { addRecentEmoji } from '../../../utils/recentEmojis';
import type { EmojiPickerSheetProps } from './EmojiPickerSheet.types';
import { styles, createEmojiSheetStyles } from './EmojiPickerSheet.styles';
import { useEmojiPickerState } from './useEmojiPickerState';
import { useSheetAnimations } from './useSheetAnimations';
import { SheetContent } from './SheetContent';

export const EmojiPickerSheet = memo(
  ({
    visible,
    habitName,
    selectedEmoji,
    onSelect,
    onClose,
  }: EmojiPickerSheetProps) => {
    const { colors: themeColors } = useThemeColors();
    const themed = useMemo(
      () => createEmojiSheetStyles(themeColors),
      [themeColors]
    );
    const state = useEmojiPickerState(visible, habitName);
    const animations = useSheetAnimations(visible, onClose);

    const handleEmojiSelect = useCallback(
      async (emoji: string) => {
        await addRecentEmoji(emoji);
        onSelect(emoji);
        animations.closeSheet();
      },
      [onSelect, animations.closeSheet]
    );

    const handleNoIcon = useCallback(() => {
      onSelect(null);
      animations.closeSheet();
    }, [onSelect, animations.closeSheet]);

    return (
      <Modal
        statusBarTranslucent
        transparent
        animationType='none'
        visible={visible}
        onRequestClose={animations.closeSheet}
      >
        <View pointerEvents='box-none' style={styles.container}>
          <Pressable
            accessibilityLabel='Close emoji picker'
            accessibilityRole='button'
            style={{ ...styles.backdrop, position: 'absolute' }}
            onPress={animations.closeSheet}
          >
            <Animated.View
              style={[styles.backdrop, animations.backdropAnimatedStyle]}
            />
          </Pressable>

          <GestureDetector gesture={animations.gesture}>
            <Animated.View
              accessibilityViewIsModal
              style={[themed.sheet, animations.sheetAnimatedStyle]}
            >
              <SheetContent
                currentCategoryName={state.currentCategoryName}
                displayedEmojis={state.displayedEmojis}
                habitName={habitName}
                handleCategorySelect={state.handleCategorySelect}
                handleClearSearch={state.handleClearSearch}
                isSearchFocused={state.isSearchFocused}
                searchBarAnimatedStyle={animations.searchBarAnimatedStyle}
                searchFocusAnim={animations.searchFocusAnim}
                searchQuery={state.searchQuery}
                selectedCategory={state.selectedCategory}
                selectedEmoji={selectedEmoji}
                setIsSearchFocused={state.setIsSearchFocused}
                setSearchQuery={state.setSearchQuery}
                suggestedEmojis={state.suggestedEmojis}
                onEmojiSelect={handleEmojiSelect}
                onNoIcon={handleNoIcon}
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </Modal>
    );
  }
);

EmojiPickerSheet.displayName = 'EmojiPickerSheet';
export default EmojiPickerSheet;
