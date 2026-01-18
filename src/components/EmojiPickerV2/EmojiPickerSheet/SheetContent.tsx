/**
 * SheetContent - Inner content of the emoji picker sheet
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CategoryPills } from '../CategoryPills';
import { EmojiGrid } from '../EmojiGrid';
import { styles } from './EmojiPickerSheet.styles';
import { SearchBar } from './SearchBar';
import { SuggestionsSection } from './SuggestionsSection';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

interface SheetContentProps {
  habitName: string;
  selectedEmoji: string | null;
  searchQuery: string;
  selectedCategory: number;
  currentCategoryName: string;
  displayedEmojis: string[];
  suggestedEmojis: string[];
  isSearchFocused: boolean;
  searchBarAnimatedStyle: AnimatedStyle<ViewStyle>;
  searchFocusAnim: SharedValue<number>;
  setIsSearchFocused: (focused: boolean) => void;
  setSearchQuery: (query: string) => void;
  handleClearSearch: () => void;
  handleCategorySelect: (category: number) => void;
  onEmojiSelect: (emoji: string) => void;
  onNoIcon: () => void;
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
}: SheetContentProps) {
  return (
    <>
      <View
        accessibilityLabel='Drag to dismiss'
        accessibilityRole='adjustable'
        style={styles.handleContainer}
      >
        <View style={styles.handle} />
      </View>

      <SearchBar
        animatedStyle={searchBarAnimatedStyle}
        isSearchFocused={isSearchFocused}
        searchFocusAnim={searchFocusAnim}
        setIsSearchFocused={setIsSearchFocused}
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={handleClearSearch}
      />

      {!searchQuery && (
        <SuggestionsSection
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          suggestedEmojis={suggestedEmojis}
          onEmojiSelect={onEmojiSelect}
        />
      )}

      {!searchQuery && (
        <CategoryPills
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      )}

      <EmojiGrid
        categoryName={searchQuery ? undefined : currentCategoryName}
        emojis={displayedEmojis}
        selectedEmoji={selectedEmoji}
        showCategoryHeader={!searchQuery}
        onEmojiSelect={onEmojiSelect}
      />

      <View style={styles.noIconContainer}>
        <Pressable
          accessibilityLabel='Select no icon for this habit'
          accessibilityRole='button'
          style={styles.noIconButton}
          onPress={onNoIcon}
        >
          <Text style={styles.noIconText}>No icon</Text>
        </Pressable>
      </View>
    </>
  );
}
