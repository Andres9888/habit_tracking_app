/**
 * HabitsSearchBar - Collapsible search bar for filtering habits
 */

import React from 'react';
import { TextInput, View, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Search, X } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface HabitsSearchBarProps {
  onChangeText: (text: string) => void;
  onClear: () => void;
  value: string;
  visible: boolean;
}

export function HabitsSearchBar({
  onChangeText,
  onClear,
  value,
  visible,
}: HabitsSearchBarProps) {
  const { colors, isDark } = useThemeColors();
  const placeholderColor = colors.text.tertiary;

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={{
        paddingHorizontal: 20,
        paddingBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? colors.card : '#fff',
          borderColor: isDark ? colors.border : '#e7e5e4',
          borderWidth: 1.5,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 11,
          gap: 10,
        }}
      >
        <Search color={placeholderColor} size={18} strokeWidth={2.25} />
        <TextInput
          accessibilityLabel='Search habits'
          placeholder='Search habits...'
          placeholderTextColor={placeholderColor}
          returnKeyType='search'
          style={{
            flex: 1,
            fontSize: 15,
            color: colors.text.primary,
          }}
          value={value}
          onChangeText={onChangeText}
        />
        {value ? (
          <Pressable
            accessibilityLabel='Clear search'
            accessibilityRole='button'
            onPress={onClear}
          >
            <X color={placeholderColor} size={18} strokeWidth={2.25} />
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}
