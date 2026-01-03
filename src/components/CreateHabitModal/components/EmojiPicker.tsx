import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';
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
import { Plus } from 'lucide-react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import STRINGS from '../../../constants/strings';
import { EmojiPickerSheet } from '../../EmojiPickerV2';
import { suggestEmojisForHabitName } from '../../../utils/emojiKeywords';

// Default emojis to show when no habit name is entered
const DEFAULT_EMOJIS = ['🎯', '✨', '💪', '📖', '🧘', '💧'];

// Debounce delay for suggestion updates (ms)
const SUGGESTION_DEBOUNCE_MS = 300;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EmojiPickerProps {
  emojis?: string[]; // kept for backwards compatibility but not used
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  habitName?: string;
}

interface EmojiChipProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion: boolean;
}

/**
 * Individual emoji chip with press animation and green ring when selected
 * V11 Spec: Scale 1.0 → 1.15 → 1.0 with spring animation (200ms total)
 * V11 Task 8: Respects reduced motion preference
 */
const EmojiChipComponent = ({ emoji, isSelected, onPress, reduceMotion }: EmojiChipProps) => {
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
    // V11 Spec: Celebratory scale 1.0 → 1.15 → 1.0 with spring
    // Total duration: ~200ms for snappy feel
    scale.value = withSequence(
      withTiming(1.15, { duration: 100 }),
      withSpring(1, { damping: 3, stiffness: 300 })
    );
  }, [scale, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={`Select emoji ${emoji}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className={`h-12 w-12 items-center justify-center rounded-xl ${
        isSelected ? 'border-2 border-[#10B981] bg-[#ECFDF5]' : 'bg-stone-100'
      }`}
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text className='text-2xl'>{emoji}</Text>
    </AnimatedPressable>
  );
};

const EmojiChip = memo(EmojiChipComponent);

const EmojiPickerComponent = ({
  selectedEmoji,
  onSelect,
  habitName,
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

  // Compute suggested emojis based on debounced habit name
  const suggestedEmojis = useMemo(() => {
    if (!debouncedHabitName.trim()) {
      return DEFAULT_EMOJIS;
    }
    const suggestions = suggestEmojisForHabitName(debouncedHabitName, 6);
    // If we have fewer than 6 suggestions, pad with defaults (avoiding duplicates)
    if (suggestions.length < 6) {
      const remaining = DEFAULT_EMOJIS.filter((e) => !suggestions.includes(e));
      return [...suggestions, ...remaining].slice(0, 6);
    }
    return suggestions;
  }, [debouncedHabitName]);

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      triggerSelection();
      onSelect(emoji);
      // Announce emoji selection for screen readers
      AccessibilityInfo.announceForAccessibility(`Selected emoji ${emoji}`);
    },
    [onSelect, triggerSelection]
  );

  const handleMorePress = useCallback(() => {
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
      <Text
        accessibilityRole='text'
        accessibilityLabel={`Suggested emojis for ${debouncedHabitName || 'your habit'}`}
        className='mb-3 text-[13px] font-semibold uppercase text-stone-500'
        style={{ letterSpacing: 0.5 }}
      >
        {STRINGS.CREATE_HABIT.iconLabel}
      </Text>

      {/* Emoji chips row with "+" button */}
      <Animated.View
        className='flex-row gap-2'
        layout={LinearTransition.springify().damping(15).stiffness(120)}
      >
        {suggestedEmojis.map((emoji) => (
          <Animated.View
            key={emoji}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            layout={LinearTransition.springify().damping(15).stiffness(120)}
          >
            <EmojiChip
              emoji={emoji}
              isSelected={selectedEmoji === emoji}
              onPress={() => handleEmojiSelect(emoji)}
              reduceMotion={reduceMotion}
            />
          </Animated.View>
        ))}
        {/* Plus button to open full emoji picker */}
        <Pressable
          accessibilityHint='Opens full emoji picker'
          accessibilityLabel='Browse all icons'
          accessibilityRole='button'
          className='h-12 w-12 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-100'
          onPress={handleMorePress}
        >
          <Plus color='#a8a29e' size={20} />
        </Pressable>
      </Animated.View>

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
