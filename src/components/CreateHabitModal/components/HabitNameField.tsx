import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import STRINGS from '../../../constants/strings';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface HabitNameFieldProps {
  value: string;
  onChange: (text: string) => void;
  autoFocus: boolean;
}

const MAX_LENGTH = 50;

const HabitNameFieldComponent = ({
  value,
  onChange,
  autoFocus,
}: HabitNameFieldProps) => {
  const charCount = value.length;
  const isNearLimit = charCount > 40;
  const [isFocused, setIsFocused] = useState(false);
  const { triggerWarning } = useHapticFeedback();
  const previousCount = useRef(charCount);

  // Animation values for focus state
  const focusProgress = useSharedValue(0);

  // Update focus animation
  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, focusProgress]);

  // Animated style for input focus
  const animatedInputStyle = useAnimatedStyle(() => ({
    borderColor:
      focusProgress.value > 0.5
        ? '#10B981' // primary.500 - emerald
        : '#e7e5e4',
    borderWidth: 2,
    elevation: focusProgress.value * 2,
    // stone-200
    shadowColor: '#10B981',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: focusProgress.value * 0.1,
    shadowRadius: focusProgress.value * 3,
  }));

  // Trigger haptic when hitting character limit
  useEffect(() => {
    if (charCount === 50 && previousCount.current < 50) {
      triggerWarning();
    }
    previousCount.current = charCount;
  }, [charCount, triggerWarning]);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <View className='mb-6'>
      <View className='mb-1 flex-row items-center justify-between'>
        <Text
          className='text-[13px] font-semibold uppercase text-stone-500'
          style={{ letterSpacing: 0.5 }}
        >
          {STRINGS.CREATE_HABIT.nameLabel}
        </Text>
        <Text
          className={`text-xs ${isNearLimit ? 'text-amber-500' : 'text-stone-400'}`}
        >
          {charCount}/{MAX_LENGTH}
        </Text>
      </View>
      <AnimatedTextInput
        blurOnSubmit
        accessibilityHint='Enter a name for your habit, up to 50 characters'
        accessibilityLabel='Habit name'
        autoFocus={autoFocus}
        className='h-14 rounded-xl bg-white px-4 text-base text-stone-800'
        maxLength={MAX_LENGTH}
        placeholder={STRINGS.CREATE_HABIT.namePlaceholder}
        placeholderTextColor='#a8a29e'
        returnKeyType='done'
        style={animatedInputStyle}
        value={value}
        onBlur={handleBlur}
        onChangeText={onChange}
        onFocus={handleFocus}
      />
      <Text className='mt-2 text-xs text-stone-400'>
        {STRINGS.CREATE_HABIT.nameHelper}
      </Text>
    </View>
  );
};

export const HabitNameField = memo(HabitNameFieldComponent);
