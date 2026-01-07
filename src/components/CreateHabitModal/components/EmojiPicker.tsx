import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Keyboard,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import STRINGS from '../../../constants/strings';
import { EmojiPickerSheet } from '../../EmojiPickerV2';
import { suggestEmojisForHabitName } from '../../../utils/emojiKeywords';

// Default emojis to show when no habit name is entered (9 for 5-4 triangle layout)
const DEFAULT_EMOJIS = ['🎯', '✨', '💪', '📖', '🧘', '💧', '🏃', '🍎', '😴'];

// Debounce delay for suggestion updates (ms)
const SUGGESTION_DEBOUNCE_MS = 300;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EmojiPickerProps {
  emojis?: string[]; // kept for backwards compatibility but not used
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  habitName?: string;
  hideLabel?: boolean; // Hide section label for cleaner centered modal design
}

interface EmojiChipProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion: boolean;
}

/**
 * Individual emoji chip with press animation and green ring when selected
 * Scale 1.0 → 1.08 → 1.0 with spring animation (200ms total)
 * V11 Task 8: Respects reduced motion preference
 */
const EmojiChipComponent = ({
  emoji,
  isSelected,
  onPress,
  reduceMotion,
}: EmojiChipProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    'worklet';
    if (reduceMotion) return;
    // Quick press down to 96% scale
    scale.value = withTiming(0.96, { duration: 50 });
  }, [scale, reduceMotion]);

  const handlePressOut = useCallback(() => {
    'worklet';
    if (reduceMotion) {
      // No animation in reduced motion mode
      scale.value = 1;
      return;
    }
    // Celebratory scale 1.0 → 1.08 → 1.0 with spring
    // Total duration: ~200ms for snappy feel
    scale.value = withSequence(
      withTiming(1.08, { duration: 100 }),
      withSpring(1, { damping: 3, stiffness: 300 })
    );
  }, [scale, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    // Fixed 56px container to prevent layout shift during scale animation (48px * 1.08 ≈ 52px)
    <View
      style={{
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
        width: 56,
      }}
    >
      <AnimatedPressable
        accessibilityLabel={`Select emoji ${emoji}`}
        accessibilityRole='button'
        accessibilityState={{ selected: isSelected }}
        className={`h-12 w-12 items-center justify-center rounded-xl ${
          isSelected
            ? 'border-2 border-[#059669] bg-[#D1FAE5]'
            : 'border border-stone-200 bg-stone-100'
        }`}
        style={[
          animatedStyle,
          isSelected && {
            elevation: 4,
            shadowColor: '#059669',
            shadowOffset: { height: 2, width: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text className='text-2xl'>{emoji}</Text>
      </AnimatedPressable>
    </View>
  );
};

const EmojiChip = memo(EmojiChipComponent);

const EmojiPickerComponent = ({
  selectedEmoji,
  onSelect,
  habitName,
  hideLabel = false,
}: EmojiPickerProps) => {
  const { triggerSelection } = useHapticFeedback();
  const reduceMotion = useReduceMotion(); // V11 Task 8: Reduced motion support
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [debouncedHabitName, setDebouncedHabitName] = useState(habitName || '');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce habit name changes to prevent jittery suggestion updates while typing
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedHabitName(habitName || '');
    }, SUGGESTION_DEBOUNCE_MS);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [habitName]);

  // Compute suggested emojis based on debounced habit name (9 for 5-4 triangle layout)
  const suggestedEmojis = useMemo(() => {
    if (!debouncedHabitName.trim()) {
      return DEFAULT_EMOJIS;
    }
    const suggestions = suggestEmojisForHabitName(debouncedHabitName, 9);
    // If we have fewer than 9 suggestions, pad with defaults (avoiding duplicates)
    if (suggestions.length < 9) {
      const remaining = DEFAULT_EMOJIS.filter((e) => !suggestions.includes(e));
      return [...suggestions, ...remaining].slice(0, 9);
    }
    return suggestions;
  }, [debouncedHabitName]);

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      // Dismiss keyboard to reveal full picker and signal interactivity
      Keyboard.dismiss();
      triggerSelection();
      onSelect(emoji);
      // Announce emoji selection for screen readers
      AccessibilityInfo.announceForAccessibility(`Selected emoji ${emoji}`);
    },
    [onSelect, triggerSelection]
  );

  const handleMorePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    setIsModalVisible(true);
  }, [triggerSelection]);

  const handleSheetSelect = useCallback(
    (emoji: string | null) => {
      onSelect(emoji);
      triggerSelection();
    },
    [onSelect, triggerSelection]
  );

  return (
    <View className='mb-4'>
      {/* Section label - V11 Task 8: Enhanced accessibility */}
      {!hideLabel && (
        <Text
          accessibilityLabel={`Suggested emojis for ${debouncedHabitName || 'your habit'}`}
          accessibilityRole='text'
          className='mb-3 text-[13px] font-semibold uppercase text-stone-500'
          style={{ letterSpacing: 0.5 }}
        >
          {STRINGS.CREATE_HABIT.iconLabel}
        </Text>
      )}

      {/* Emoji chips in 5-4 triangle layout */}
      <View className='items-center'>
        {/* Row 1: First 5 emojis */}
        <Animated.View
          className='flex-row justify-center'
          layout={LinearTransition.springify().damping(15).stiffness(120)}
        >
          {suggestedEmojis.slice(0, 5).map((emoji) => (
            <Animated.View
              key={emoji}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              layout={LinearTransition.springify().damping(15).stiffness(120)}
            >
              <EmojiChip
                emoji={emoji}
                isSelected={selectedEmoji === emoji}
                reduceMotion={reduceMotion}
                onPress={() => handleEmojiSelect(emoji)}
              />
            </Animated.View>
          ))}
        </Animated.View>

        {/* Row 2: Last 4 emojis */}
        <Animated.View
          className='flex-row justify-center'
          layout={LinearTransition.springify().damping(15).stiffness(120)}
        >
          {suggestedEmojis.slice(5, 9).map((emoji) => (
            <Animated.View
              key={emoji}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              layout={LinearTransition.springify().damping(15).stiffness(120)}
            >
              <EmojiChip
                emoji={emoji}
                isSelected={selectedEmoji === emoji}
                reduceMotion={reduceMotion}
                onPress={() => handleEmojiSelect(emoji)}
              />
            </Animated.View>
          ))}
        </Animated.View>
      </View>

      {/* Browse more emojis link */}
      <Pressable
        accessibilityHint='Opens full emoji picker with hundreds of options'
        accessibilityLabel='Browse more emojis'
        accessibilityRole='button'
        className='mt-2 flex-row items-center justify-center py-1'
        onPress={handleMorePress}
      >
        <Text className='text-sm font-medium text-emerald-600'>
          Browse more emojis
        </Text>
        <Text className='ml-1 text-emerald-600'>→</Text>
      </Pressable>

      <EmojiPickerSheet
        habitName={habitName || ''}
        selectedEmoji={selectedEmoji}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handleSheetSelect}
      />
    </View>
  );
};

export const EmojiPicker = memo(EmojiPickerComponent);
