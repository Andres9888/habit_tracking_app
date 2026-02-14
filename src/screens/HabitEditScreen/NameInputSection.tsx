/**
 * NameInputSection - Matches Create modal style
 * 34px hero title, centered input with subtle border
 */

import { View, Text, TextInput, Keyboard } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { typography } from '../../theme/typography';

interface NameInputSectionProps {
  habitName: string;
  onChangeText: (text: string) => void;
}

export function NameInputSection({
  habitName,
  onChangeText,
}: NameInputSectionProps) {
  return (
    <View className='px-4'>
      {/* Hero Title - 34px bold centered like Create modal */}
      <Animated.View
        className='mb-6'
        entering={FadeInDown.duration(240).delay(100)}
      >
        <Text
          accessibilityRole='header'
          className='text-center font-bold text-stone-900'
          style={typography.heading1}
        >
          Edit your habit
        </Text>
      </Animated.View>

      {/* Name Input */}
      <Animated.View entering={FadeInUp.duration(240).delay(160)}>
        <TextInput
          accessibilityLabel='Habit name'
          className='w-full rounded-2xl border-2 border-stone-200 bg-white px-5 py-4 text-center font-medium text-stone-900'
          maxLength={50}
          placeholder='e.g., Read for 20 minutes'
          placeholderTextColor='#a1a1aa'
          returnKeyType='done'
          style={typography.heading2}
          value={habitName}
          onChangeText={onChangeText}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Text style={typography.caption} className='mt-2 text-center text-stone-400'>
          {habitName.length}/50 characters
        </Text>
      </Animated.View>
    </View>
  );
}
