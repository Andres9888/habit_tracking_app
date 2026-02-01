/**
 * NameInputSection Component
 *
 * Text input section for editing the habit name.
 * Includes title, validation, and keyboard handling.
 */

import { View, Text, TextInput, Keyboard } from 'react-native';

interface NameInputSectionProps {
  habitName: string;
  onChangeText: (text: string) => void;
}

export function NameInputSection({
  habitName,
  onChangeText,
}: NameInputSectionProps) {
  return (
    <View className='items-center' style={{ marginBottom: 32, marginTop: 32 }}>
      <Text className='mb-3 text-center text-2xl font-bold text-stone-900'>
        Edit your habit
      </Text>

      <TextInput
        className='w-full rounded-2xl border-2 border-stone-200 bg-white px-6 py-5 text-center text-xl text-stone-900'
        maxLength={50}
        placeholder='e.g., Read for 20 minutes'
        placeholderTextColor='#A8A29E'
        returnKeyType='done'
        value={habitName}
        onChangeText={onChangeText}
        onSubmitEditing={Keyboard.dismiss}
      />

      <Text className='mt-2 text-xs text-stone-400'>
        {habitName.length}/50 characters
      </Text>
    </View>
  );
}
