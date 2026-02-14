/**
 * SearchInput Component
 * Search input for filtering notes
 */

import React from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
}) => {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='relative'>
      <TextInput
        accessibilityLabel='Search notes'
        className='w-full rounded-2xl py-3 pl-11 pr-4 text-sm font-medium'
        placeholder='Search notes...'
        placeholderTextColor={themeColors.text.tertiary}
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          borderWidth: 1,
          color: themeColors.text.primary,
        }}
        value={value}
        onChangeText={onChangeText}
      />
      <View className='absolute left-4 top-3.5'>
        <Search color={themeColors.text.tertiary} size={18} strokeWidth={2} />
      </View>
    </View>
  );
};
