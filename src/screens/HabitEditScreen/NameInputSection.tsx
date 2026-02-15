/**
 * NameInputSection - Matches Create modal style
 * 34px hero title, centered input with subtle border
 */

import { View, Text, TextInput, Keyboard } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

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
          style={{
            fontSize: 34,
            letterSpacing: -34 * 0.02,
            lineHeight: 34 * 1.2,
          }}
        >
          Edit your habit
        </Text>
      </Animated.View>

      {/* Name Input */}
      <Animated.View entering={FadeInUp.duration(240).delay(160)}>
        <TextInput
          accessibilityLabel='Habit name'
          className='w-full rounded-2xl border-2 border-stone-200 bg-white px-5 py-4 text-center text-[22px] font-medium text-stone-900'
          maxLength={50}
          placeholder='e.g., Read 20 minutes daily'
          placeholderTextColor='#a1a1aa'
          returnKeyType='done'
          style={{ lineHeight: 28 }}
          value={habitName}
          onChangeText={onChangeText}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Text className='mt-2 text-center text-[13px] text-stone-400'>
          {habitName.length}/50 characters
          {habitName.length > 0 && habitName.trim().length < 2
            ? ' · At least 2 characters required'
            : ''}
        </Text>
      </Animated.View>
    </View>
  );
}
