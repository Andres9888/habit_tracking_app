/**
 * SearchBar Component
 * Animated search input with focus effects
 */

import React, { useCallback } from 'react';
import { View, TextInput, Pressable, type ViewStyle } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  withTiming,
  type AnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { styles } from './EmojiPickerSheet.styles';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  searchFocusAnim: SharedValue<number>;
  animatedStyle: AnimatedStyle<ViewStyle>;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  isSearchFocused,
  setIsSearchFocused,
  searchFocusAnim,
  animatedStyle,
}: SearchBarProps) {
  const handleFocus = useCallback(() => {
    setIsSearchFocused(true);
    searchFocusAnim.value = withTiming(1, { duration: 200 });
  }, [searchFocusAnim, setIsSearchFocused]);

  const handleBlur = useCallback(() => {
    setIsSearchFocused(false);
    searchFocusAnim.value = withTiming(0, { duration: 150 });
  }, [searchFocusAnim, setIsSearchFocused]);

  return (
    <View style={styles.searchContainer}>
      <Animated.View style={[styles.searchBar, animatedStyle]}>
        <Search color={isSearchFocused ? '#3b82f6' : '#a8a29e'} size={20} />
        <TextInput
          accessibilityHint='Type keywords to search for emojis'
          accessibilityLabel='Search emojis'
          placeholder='Search or type habit name...'
          placeholderTextColor='#a8a29e'
          returnKeyType='search'
          style={styles.searchInput}
          value={value}
          onBlur={handleBlur}
          onChangeText={onChange}
          onFocus={handleFocus}
        />
        {value.length > 0 && (
          <Pressable
            accessibilityLabel='Clear search'
            accessibilityRole='button'
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            onPress={onClear}
          >
            <X color='#9ca3af' size={18} />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}
