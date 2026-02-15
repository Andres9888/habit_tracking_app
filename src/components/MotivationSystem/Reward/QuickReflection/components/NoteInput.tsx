
import React from 'react';
import { View, Text, TextInput } from 'react-native';

import { MessageSquare } from 'lucide-react-native';

interface NoteInputProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}

/**
 * NoteInput Component
 * Optional note text input for reflection
 */
export function NoteInput({ value, onChange, onSubmit }: NoteInputProps) {
  return (
    <View className='mt-2'>
      <View className='mb-2 flex-row items-center gap-2'>
        <MessageSquare className='text-emerald-500' size={14} />
        <Text className='text-xs font-medium text-stone-600'>
          Add a note (optional)
        </Text>
      </View>
      <TextInput
        multiline
        className='rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700'
        maxLength={500}
        numberOfLines={3}
        placeholder='What made it great? Any challenges?'
        placeholderTextColor='#a8a29e'
        style={{ minHeight: 80 }}
        textAlignVertical='top'
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
      />
      <View className='mt-1 flex-row justify-between'>
        <Text className='text-xs text-stone-400'>Press return to save</Text>
        <Text className='text-xs text-stone-400'>{value.length}/500</Text>
      </View>
    </View>
  );
}
