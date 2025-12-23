import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextInput, View } from 'react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface HeroNameInputProps {
  autoFocus: boolean;
  onChange: (text: string) => void;
  value: string;
}

const MAX_LENGTH = 50;

const getValidationMessage = (name: string): { message: string; type: 'success' | 'tip' | 'warning' } | null => {
  const trimmed = name.trim();
  if (!trimmed) return null;

  if (trimmed.length >= 10 && /\d/.test(trimmed)) {
    return { message: '✓ Great habit! Specific & achievable 👏', type: 'success' };
  }

  if (trimmed.length >= 5) {
    return { message: '💡 Add a number for specificity (e.g., "10 min")', type: 'tip' };
  }

  return null;
};

export const HeroNameInput = ({ autoFocus, onChange, value }: HeroNameInputProps) => {
  const charCount = value.length;
  const isNearLimit = charCount > 40;
  const { triggerWarning } = useHapticFeedback();
  const previousCount = useRef(charCount);
  const inputRef = useRef<TextInput>(null);

  // Animation values
  const labelOpacity = useRef(new Animated.Value(1)).current;
  const validationOpacity = useRef(new Animated.Value(0)).current;
  const validationTranslateY = useRef(new Animated.Value(-10)).current;

  const [validation, setValidation] = useState<ReturnType<typeof getValidationMessage>>(null);

  // Trigger haptic when hitting character limit
  useEffect(() => {
    if (charCount === MAX_LENGTH && previousCount.current < MAX_LENGTH) {
      triggerWarning();
    }
    previousCount.current = charCount;
  }, [charCount, triggerWarning]);

  // Update validation message with animation
  useEffect(() => {
    const newValidation = getValidationMessage(value);

    if (newValidation?.message !== validation?.message) {
      // Fade out
      Animated.timing(validationOpacity, {
        duration: Motion.duration.fast,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setValidation(newValidation);
        if (newValidation) {
          // Reset and fade in
          validationTranslateY.setValue(-10);
          Animated.parallel([
            Animated.timing(validationOpacity, {
              duration: Motion.duration.base,
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.spring(validationTranslateY, {
              damping: 15,
              stiffness: 200,
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
        }
      });
    }
  }, [value, validation?.message, validationOpacity, validationTranslateY]);

  const getValidationColor = () => {
    switch (validation?.type) {
      case 'success':
        return 'text-emerald-600';
      case 'warning':
        return 'text-amber-600';
      default:
        return 'text-stone-500';
    }
  };

  return (
    <View className="mb-4">
      {/* Hero Label */}
      <Animated.Text
        className="mb-3 text-xl font-bold text-stone-800"
        style={{ opacity: labelOpacity }}
      >
        What habit do you want to build?
      </Animated.Text>

      {/* Input Container */}
      <View className="relative">
        <TextInput
          ref={inputRef}
          accessibilityHint="Enter the name of your new habit"
          accessibilityLabel="Habit name input"
          autoFocus={autoFocus}
          blurOnSubmit
          className="h-16 rounded-2xl bg-white px-5 pr-16 text-lg font-medium text-stone-800 shadow-sm"
          maxLength={MAX_LENGTH}
          placeholder="e.g., Read for 10 minutes"
          placeholderTextColor="#a8a29e"
          returnKeyType="done"
          style={{
            borderColor: value.length > 0 ? '#3b82f6' : '#e7e5e4',
            borderWidth: value.length > 0 ? 2 : 1,
          }}
          value={value}
          onChangeText={onChange}
        />

        {/* Character Count */}
        <View className="absolute right-4 top-1/2 -transtone-y-1/2">
          <Text
            className={`text-xs font-medium ${
              isNearLimit ? 'text-amber-500' : 'text-stone-400'
            }`}
          >
            {charCount}/{MAX_LENGTH}
          </Text>
        </View>
      </View>

      {/* Validation Feedback */}
      {validation && (
        <Animated.View
          className="mt-2"
          style={{
            opacity: validationOpacity,
            transform: [{ translateY: validationTranslateY }],
          }}
        >
          <Text className={`text-sm font-medium ${getValidationColor()}`}>
            {validation.message}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default HeroNameInput;
