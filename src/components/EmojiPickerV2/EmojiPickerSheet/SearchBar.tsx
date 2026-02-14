/**
 * SearchBar Component
 * Animated search input with focus effects and dark mode support
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
import { colors } from '../../../theme/colors';
import { styles, themedStyles } from './EmojiPickerSheet.styles';
import type { SemanticColors } from '../../../theme/darkColors';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  searchFocusAnim: SharedValue<number>;
  animatedStyle: AnimatedStyle<ViewStyle>;
  themeColors: SemanticColors;
  isDark: boolean;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  isSearchFocused,
  setIsSearchFocused,
  searchFocusAnim,
  animatedStyle,
  themeColors,
  isDark,
}: SearchBarProps) {
  const themed = themedStyles(themeColors);

  const handleFocus = useCallback(() => {
    setIsSearchFocused(true);
    searchFocusAnim.value = withTiming(1, { duration: 200 });
  }, [searchFocusAnim, setIsSearchFocused]);

  const handleBlur = useCallback(() => {
    setIsSearchFocused(false);
    searchFocusAnim.value = withTiming(0, { duration: 150 });
  }, [searchFocusAnim, setIsSearchFocused]);

  const iconColor = isSearchFocused
    ? colors.secondary[500]
    : themeColors.gray[400];

  return (
    <View style={styles.searchContainer}>
      <Animated.View
        style={[styles.searchBar, themed.searchBar, animatedStyle]}
      >
        <Search color={iconColor} size={20} />
        <TextInput
          accessibilityHint='Type keywords to search for emojis'
          accessibilityLabel='Search emojis'
          placeholder='Search or type habit name...'
          placeholderTextColor={themeColors.gray[400]}
          returnKeyType='search'
          style={[styles.searchInput, themed.searchInput]}
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
            <X color={themeColors.gray[400]} size={18} />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}
