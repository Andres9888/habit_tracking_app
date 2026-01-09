/**
 * EmojiPickerSheet Component
 * Main orchestrator for the emoji picker bottom sheet
 */

import React, { memo, useCallback } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { addRecentEmoji } from '../../../utils/recentEmojis';
import { CategoryPills } from '../CategoryPills';
import { EmojiGrid } from '../EmojiGrid';
import type { EmojiPickerSheetProps } from './EmojiPickerSheet.types';
import { styles } from './EmojiPickerSheet.styles';
import { useEmojiPickerState } from './useEmojiPickerState';
import { useSheetAnimations } from './useSheetAnimations';
import { SearchBar } from './SearchBar';
import { SuggestionsSection } from './SuggestionsSection';

export const EmojiPickerSheet = memo(
  ({
    visible,
    habitName,
    selectedEmoji,
    onSelect,
    onClose,
  }: EmojiPickerSheetProps) => {
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
              style={[styles.sheet, animations.sheetAnimatedStyle]}
            >
              <View
                accessibilityLabel='Drag to dismiss'
                accessibilityRole='adjustable'
                style={styles.handleContainer}
              >
                <View style={styles.handle} />
              </View>

              <SearchBar
                animatedStyle={animations.searchBarAnimatedStyle}
                isSearchFocused={state.isSearchFocused}
                searchFocusAnim={animations.searchFocusAnim}
                setIsSearchFocused={state.setIsSearchFocused}
                value={state.searchQuery}
                onChange={state.setSearchQuery}
                onClear={state.handleClearSearch}
              />

              {!state.searchQuery && (
                <SuggestionsSection
                  habitName={habitName}
                  selectedEmoji={selectedEmoji}
                  suggestedEmojis={state.suggestedEmojis}
                  onEmojiSelect={handleEmojiSelect}
                />
              )}

              {!state.searchQuery && (
                <CategoryPills
                  selectedCategory={state.selectedCategory}
                  onCategorySelect={state.handleCategorySelect}
                />
              )}

              <EmojiGrid
                categoryName={
                  state.searchQuery ? undefined : state.currentCategoryName
                }
                emojis={state.displayedEmojis}
                selectedEmoji={selectedEmoji}
                showCategoryHeader={!state.searchQuery}
                onEmojiSelect={handleEmojiSelect}
              />

              <View style={styles.noIconContainer}>
                <Pressable
                  accessibilityLabel='Select no icon for this habit'
                  accessibilityRole='button'
                  style={styles.noIconButton}
                  onPress={handleNoIcon}
                >
                  <Text style={styles.noIconText}>No icon</Text>
                </Pressable>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </Modal>
    );
  }
);

EmojiPickerSheet.displayName = 'EmojiPickerSheet';
export default EmojiPickerSheet;
