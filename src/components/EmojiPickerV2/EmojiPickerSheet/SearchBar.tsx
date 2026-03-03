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
import { useThemeColors } from '../../../theme';
import { colors } from '../../../theme/colors';
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
  const { colors: themeColors } = useThemeColors();

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
      <Animated.View
        style={[
          styles.searchBar,
          { backgroundColor: themeColors.gray[50] },
          animatedStyle,
        ]}
      >
        <Search
          color={isSearchFocused ? colors.secondary[500] : colors.gray[400]}
          size={20}
        />
        <TextInput
          accessibilityHint='Type keywords to search for emojis'
          accessibilityLabel='Search emojis'
          placeholder='Search or type habit name...'
          placeholderTextColor={colors.gray[400]}
          returnKeyType='search'
          style={[styles.searchInput, { color: themeColors.gray[900] }]}
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
            <X color={colors.gray[400]} size={18} />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}
