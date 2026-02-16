/**
 * SearchInput Component
 * Search input for filtering notes
 */

import React from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { sanitizeSearchQuery } from '../../../../utils/inputSanitization';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
}) => {
  const { colors } = useThemeColors();

  const handleTextChange = (text: string) => {
    const sanitized = sanitizeSearchQuery(text);
    onChangeText(sanitized);
  };

  return (
    <View className='relative'>
      <TextInput
        accessibilityLabel='Search notes'
        className='w-full rounded-2xl border py-3 pl-11 pr-4 text-sm font-medium'
        placeholder='Search notes...'
        placeholderTextColor={colors.text.tertiary}
        returnKeyType='search'
        style={{ borderColor: colors.border, backgroundColor: colors.card, color: colors.text.primary }}
        value={value}
        onChangeText={handleTextChange}
      />
      <View className='absolute left-4 top-3.5'>
        <Search color={colors.text.tertiary} size={18} strokeWidth={2} />
      </View>
    </View>
  );
};
