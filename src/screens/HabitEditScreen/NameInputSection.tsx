/**
 * NameInputSection Component
 *
 * Card-based text input for editing the habit name.
 * Features label, input with focus styling, and character counter.
 */

import { useState } from 'react';
import { View, Text, TextInput, Keyboard, StyleSheet } from 'react-native';
import { Card } from './Card';

interface NameInputSectionProps {
  habitName: string;
  onChangeText: (text: string) => void;
}

export function NameInputSection({
  habitName,
  onChangeText,
}: NameInputSectionProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Card delay={100} icon='📝' title='Habit Name'>
      <View>
        <TextInput
          accessibilityLabel='Habit name'
          className='w-full rounded-2xl border-2 bg-white px-4 py-4 text-lg font-medium text-stone-900'
          maxLength={50}
          placeholder='e.g., Read for 20 minutes'
          placeholderTextColor='#A8A29E'
          returnKeyType='done'
          style={[
            styles.input,
            isFocused ? styles.inputFocused : styles.inputDefault,
          ]}
          value={habitName}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onSubmitEditing={Keyboard.dismiss}
        />

        <Text className='mt-2 text-right text-xs text-stone-400'>
          {habitName.length}/50
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    lineHeight: 25,
  },
  inputDefault: {
    borderColor: '#e7e5e4',
  },
  inputFocused: {
    borderColor: '#10B981',
  },
});
