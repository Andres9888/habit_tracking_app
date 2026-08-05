/**
 * EmojiPickerSheet Component
 * Main orchestrator for the emoji picker bottom sheet
 */

import React, { memo } from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { EmojiPickerSheetProps } from './EmojiPickerSheet.types';
import { styles } from './EmojiPickerSheet.styles';
import { useEmojiPickerState } from './useEmojiPickerState';
import { useSheetAnimations } from './useSheetAnimations';
import { useSheetHandlers } from './useSheetHandlers';
import { SheetContent } from './SheetContent';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

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
    const handlers = useSheetHandlers(
      onSelect,
      state.setIsSearchFocused,
      animations
    );
    const displayedSelectedEmoji = handlers.pendingEmoji ?? selectedEmoji;

    return (
      <Modal
        accessibilityViewIsModal
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
            style={StyleSheet.absoluteFill}
            onPress={animations.closeSheet}
          >
            <AnimatedBlurView
              intensity={20}
              style={[
                StyleSheet.absoluteFill,
                animations.backdropAnimatedStyle,
              ]}
              tint='dark'
            />
          </Pressable>

          <GestureDetector gesture={animations.gesture}>
            <View collapsable={false}>
              <Animated.View
                accessibilityViewIsModal
                style={[styles.sheet, animations.sheetAnimatedStyle]}
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
                  selectedEmoji={displayedSelectedEmoji}
                  setIsSearchFocused={handlers.handleSearchFocus}
                  setSearchQuery={state.setSearchQuery}
                  suggestedEmojis={state.suggestedEmojis}
                  onEmojiSelect={handlers.handleEmojiSelect}
                  onNoIcon={handlers.handleNoIcon}
                />
              </Animated.View>
            </View>
          </GestureDetector>
        </View>
      </Modal>
    );
  }
);

EmojiPickerSheet.displayName = 'EmojiPickerSheet';
export default EmojiPickerSheet;
