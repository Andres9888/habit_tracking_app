/**
 * SheetContent - Inner content of the emoji picker sheet
 * Theme-aware with dark mode support
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryPills } from '../CategoryPills';
import { EmojiGrid } from '../EmojiGrid';
import { styles, themedStyles } from './EmojiPickerSheet.styles';
import { SearchBar } from './SearchBar';
import { SuggestionsSection } from './SuggestionsSection';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { SemanticColors } from '../../../theme/darkColors';

interface SheetContentProps {
  habitName: string;
  selectedEmoji: string | null;
  searchQuery: string;
  selectedCategory: string;
  currentCategoryName: string;
  displayedEmojis: string[];
  suggestedEmojis: string[];
  isSearchFocused: boolean;
  searchBarAnimatedStyle: AnimatedStyle<ViewStyle>;
  searchFocusAnim: SharedValue<number>;
  setIsSearchFocused: (focused: boolean) => void;
  setSearchQuery: (query: string) => void;
  handleClearSearch: () => void;
  handleCategorySelect: (categoryId: string) => void;
  onEmojiSelect: (emoji: string) => void;
  onNoIcon: () => void;
  themeColors: SemanticColors;
  isDark: boolean;
}

export function SheetContent({
  habitName,
  selectedEmoji,
  searchQuery,
  selectedCategory,
  currentCategoryName,
  displayedEmojis,
  suggestedEmojis,
  isSearchFocused,
  searchBarAnimatedStyle,
  searchFocusAnim,
  setIsSearchFocused,
  setSearchQuery,
  handleClearSearch,
  handleCategorySelect,
  onEmojiSelect,
  onNoIcon,
  themeColors,
  isDark,
}: SheetContentProps) {
  const themed = themedStyles(themeColors);

  return (
    <>
      <View
        accessibilityLabel='Drag to dismiss'
        accessibilityRole='adjustable'
        style={styles.handleContainer}
      >
        <View style={themed.handle} />
      </View>

      <SearchBar
        animatedStyle={searchBarAnimatedStyle}
        isDark={isDark}
        isSearchFocused={isSearchFocused}
        searchFocusAnim={searchFocusAnim}
        setIsSearchFocused={setIsSearchFocused}
        themeColors={themeColors}
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={handleClearSearch}
      />

      {!searchQuery && (
        <SuggestionsSection
          habitName={habitName}
          isDark={isDark}
          selectedEmoji={selectedEmoji}
          suggestedEmojis={suggestedEmojis}
          themeColors={themeColors}
          onEmojiSelect={onEmojiSelect}
        />
      )}

      {!searchQuery && (
        <CategoryPills
          selectedCategory={selectedCategory}
          themeColors={themeColors}
          onCategorySelect={handleCategorySelect}
        />
      )}

      <EmojiGrid
        categoryName={searchQuery ? undefined : currentCategoryName}
        emojis={displayedEmojis}
        selectedEmoji={selectedEmoji}
        showCategoryHeader={!searchQuery}
        themeColors={themeColors}
        onEmojiSelect={onEmojiSelect}
      />

      <View style={[styles.noIconContainer, themed.noIconContainer]}>
        <Pressable
          accessibilityLabel='Select no icon for this habit'
          accessibilityRole='button'
          style={[styles.noIconButton, themed.noIconButton]}
          onPress={onNoIcon}
        >
          <Text style={[styles.noIconText, themed.noIconText]}>No icon</Text>
        </Pressable>
      </View>
    </>
  );
}
