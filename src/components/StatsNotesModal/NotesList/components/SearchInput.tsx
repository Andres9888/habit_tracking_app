/**
 * SearchInput Component
 * Search input for filtering notes — dark mode aware
 */

import React from 'react';
import { View } from 'react-native';
import { Search } from 'lucide-react-native';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { useThemeColors } from '@/theme/ThemeContext';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
}) => {
  const { isDark } = useThemeColors();

  return (
    <View className='relative'>
      <ThemedTextInput
        accessibilityLabel='Search notes'
        placeholder='Search notes...'
        style={{ paddingLeft: 44 }}
        value={value}
        onChangeText={onChangeText}
      />
      <View className='absolute left-4 top-3.5'>
        <Search color={isDark ? '#6B7280' : '#a8a29e'} size={18} strokeWidth={2} />
      </View>
    </View>
  );
};
