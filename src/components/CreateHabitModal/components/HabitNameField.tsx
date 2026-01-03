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
const MAX_CHARS = 40; // V11: Soft limit for character counter
const WARNING_THRESHOLD = 30;
const SHOW_THRESHOLD = 20;

const HabitNameFieldComponent = ({
  value,
  onChange,
  autoFocus,
}: HabitNameFieldProps) => {
  const charCount = value.length;
  const showCounter = charCount > SHOW_THRESHOLD;
  const isWarning = charCount > WARNING_THRESHOLD;
  const isError = charCount > MAX_CHARS;
  const [isFocused, setIsFocused] = useState(false);
  const { triggerWarning } = useHapticFeedback();
  const previousCount = useRef(charCount);

  // Animation values for focus state
  const focusProgress = useSharedValue(0);

  // V11: Shake animation for character limit
  const shakeTranslate = useSharedValue(0);

  // Update focus animation
  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, focusProgress]);

  // Animated style for input focus
  const animatedInputStyle = useAnimatedStyle(() => ({
    borderColor:
      focusProgress.value > 0.5
        ? '#10B981' // primary.500 - emerald
        : isError
          ? '#EF4444' // red-500
          : '#e7e5e4', // stone-200
    borderWidth: 2,
    elevation: focusProgress.value * 2,
    shadowColor: '#10B981',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: focusProgress.value * 0.1,
    shadowRadius: focusProgress.value * 3,
    transform: [{ translateX: shakeTranslate.value }],
  }));

  // V11: Trigger haptic and shake when exceeding MAX_CHARS
  useEffect(() => {
    // Trigger haptic at hard limit (50)
    if (charCount === MAX_LENGTH && previousCount.current < MAX_LENGTH) {
      triggerWarning();
    }
    // V11: Shake animation when exceeding soft limit (40)
    if (charCount > MAX_CHARS && previousCount.current <= MAX_CHARS) {
      triggerWarning();
      // Shake animation: 10px right, 10px left, 10px right, center
      shakeTranslate.value = withTiming(10, { duration: 50 }, () => {
        shakeTranslate.value = withTiming(-10, { duration: 50 }, () => {
          shakeTranslate.value = withTiming(10, { duration: 50 }, () => {
            shakeTranslate.value = withTiming(0, { duration: 50 });
          });
        });
      });
    }
    previousCount.current = charCount;
  }, [charCount, triggerWarning, shakeTranslate]);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  // V11: Determine counter color based on character count
  const counterColor = isError
    ? '#EF4444' // red-500
    : isWarning
      ? '#F59E0B' // amber-500
      : '#78716c'; // stone-500

  return (
    <View className='mb-3'>
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

      {/* V11: Character counter - only show when > 20 chars */}
      {showCounter && (
        <Text
          accessibilityLabel={`${charCount} of ${MAX_CHARS} characters used${isWarning ? ', approaching limit' : ''}${isError ? ', limit exceeded' : ''}`}
          accessibilityRole='text'
          className='mt-1 text-center text-xs'
          style={{ color: counterColor }}
        >
          {charCount}/{MAX_CHARS}
        </Text>
      )}
    </View>
  );
};

export const HabitNameField = memo(HabitNameFieldComponent);
