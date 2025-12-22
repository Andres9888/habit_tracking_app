import { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Text, TextInput, View, Pressable, Keyboard } from 'react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface InlineEmojiInputProps {
  emoji: string | null;
  color: string;
  value: string;
  onChange: (text: string) => void;
  onFocus: () => void;
  onEmojiPress: () => void;
  autoFocus: boolean;
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

export const InlineEmojiInput = ({
  emoji,
  color,
  value,
  onChange,
  onFocus,
  onEmojiPress,
  autoFocus,
}: InlineEmojiInputProps) => {
  const charCount = value.length;
  const isNearLimit = charCount > 40;
  const { triggerWarning, triggerSelection } = useHapticFeedback();
  const previousCount = useRef(charCount);
  const inputRef = useRef<TextInput>(null);

  // Animation values
  const validationOpacity = useRef(new Animated.Value(0)).current;
  const validationTranslateY = useRef(new Animated.Value(-10)).current;
  const emojiScale = useRef(new Animated.Value(1)).current;
  const emojiBoxScale = useRef(new Animated.Value(1)).current;

  const [validation, setValidation] = useState<ReturnType<typeof getValidationMessage>>(null);

  // Trigger haptic when hitting character limit
  useEffect(() => {
    if (charCount === MAX_LENGTH && previousCount.current < MAX_LENGTH) {
      triggerWarning();
    }
    previousCount.current = charCount;
  }, [charCount, triggerWarning]);

  // Animate emoji bounce when it changes
  useEffect(() => {
    if (emoji) {
      Animated.sequence([
        Animated.spring(emojiScale, {
          damping: 8,
          stiffness: 300,
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.spring(emojiScale, {
          damping: 8,
          stiffness: 300,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [emoji, emojiScale]);

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
        return 'text-slate-500';
    }
  };

  const handleEmojiBoxPressIn = useCallback(() => {
    Animated.timing(emojiBoxScale, {
      duration: Motion.duration.fast,
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  }, [emojiBoxScale]);

  const handleEmojiBoxPressOut = useCallback(() => {
    Animated.spring(emojiBoxScale, {
      toValue: 1,
      damping: 12,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, [emojiBoxScale]);

  const handleEmojiBoxPress = useCallback(() => {
    triggerSelection();
    Keyboard.dismiss();
    onEmojiPress();
  }, [triggerSelection, onEmojiPress]);

  const displayEmoji = emoji || '✨';
  const isDefaultEmoji = !emoji;

  return (
    <View className="mb-4">
      {/* Input Container with Emoji Prefix */}
      <View className="relative">
        {/* Emoji Prefix - inside input, left side */}
        <Animated.View
          className="absolute left-3 top-1/2 z-10"
          style={{
            transform: [
              { translateY: -20 }, // Center vertically (half of 40px height)
              { scale: emojiBoxScale }
            ]
          }}
        >
          <Pressable
            accessibilityLabel="Choose habit icon"
            accessibilityRole="button"
            accessibilityHint="Opens emoji picker"
            onPress={handleEmojiBoxPress}
            onPressIn={handleEmojiBoxPressIn}
            onPressOut={handleEmojiBoxPressOut}
          >
            <Animated.View
              className="h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: isDefaultEmoji ? '#f1f5f9' : `${color}30`,
                transform: [{ scale: emojiScale }],
              }}
            >
              <Text
                className="text-xl"
                style={{ opacity: isDefaultEmoji ? 0.4 : 1 }}
              >
                {displayEmoji}
              </Text>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* Input Field with left padding for emoji */}
        <TextInput
          ref={inputRef}
          accessibilityHint="Enter the name of your new habit"
          accessibilityLabel="Habit name input"
          autoFocus={autoFocus}
          blurOnSubmit
          className="h-14 rounded-2xl bg-white pl-16 pr-14 text-base font-medium text-slate-800 shadow-sm"
          maxLength={MAX_LENGTH}
          placeholder="What habit to build?"
          placeholderTextColor="#94a3b8"
          returnKeyType="done"
          style={{
            borderColor: value.length > 0 ? '#10b981' : '#e2e8f0',
            borderWidth: value.length > 0 ? 2 : 1,
          }}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
        />

        {/* Character Count - right side */}
        <View className="absolute right-3 top-1/2 -translate-y-1/2">
          <Text
            className={`text-xs font-medium ${
              isNearLimit ? 'text-amber-500' : 'text-slate-400'
            }`}
          >
            {charCount}/{MAX_LENGTH}
          </Text>
        </View>
      </View>

      {/* Validation Feedback */}
      {validation && (
        <Animated.View
          className="mt-2 px-1"
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

export default InlineEmojiInput;
