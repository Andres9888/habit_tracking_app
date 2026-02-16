/**
 * SearchInput Component
 * Search input for filtering notes
 */

import React from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
}) => (
  <View className='relative'>
    <TextInput
      accessibilityLabel='Search notes'
      className='w-full rounded-2xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-stone-900'
      placeholder='Search notes...'
      placeholderTextColor='#a8a29e'
      returnKeyType='search'
      value={value}
      onChangeText={onChangeText}
    />
    <View className='absolute left-4 top-3.5'>
      <Search color='#a8a29e' size={18} strokeWidth={2} />
    </View>
  </View>
);
