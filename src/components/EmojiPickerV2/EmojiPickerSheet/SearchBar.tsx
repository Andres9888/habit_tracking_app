/**
 * SearchBar Component
 * Animated search input with focus effects
 */

import React, { useCallback } from 'react';
import { View, TextInput, Pressable, type ViewStyle } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Animated, {
  withTiming,
  type AnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { colors } from '../../../theme/colors';
import { styles } from './EmojiPickerSheet.styles';
import { iconSizes } from '@/theme/iconSizes';

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
        <Search
          color={isSearchFocused ? colors.secondary[500] : colors.gray[400]}
          size={iconSizes.medium}
        />
        <TextInput
          accessibilityHint='Type keywords to search for emojis'
          accessibilityLabel='Search emojis'
          returnKeyType='search'
          style={styles.searchInput}
          value={value}
          {...buildTextInputHintProps(
            'Search or type habit name...',
            colors.gray[400]
          )}
          onBlur={handleBlur}
          onChangeText={onChange}
          onFocus={handleFocus}
        />
        {value.length > 0 ? <Pressable
            accessibilityLabel='Clear search'
            accessibilityRole='button'
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            onPress={onClear}
          >
            <X color={colors.gray[400]} size={iconSizes.medium} />
          </Pressable> : null}
      </Animated.View>
    </View>
  );
}
