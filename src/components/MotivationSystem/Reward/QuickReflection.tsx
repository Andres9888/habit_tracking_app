/**
 * QuickReflection Component
 * Post-habit emoji rating + optional note for the Motivation System
 *
 * Scientific basis:
 * - BJ Fogg (Stanford, "Tiny Habits"): Celebration wires habits
 * - Journaling increases self-awareness and consistency
 * - Daylio validation: 50M+ downloads, reflection = 60% higher retention
 *
 * Features:
 * - 4 emoji options: 😤 frustrated, 😐 neutral, 😊 happy, 🔥 fire
 * - Optional text note with 500 char limit
 * - Emerald accent color scheme
 * - Animated selection feedback with haptics
 * - Accessibility support (reduce motion, screen reader labels)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Keyboard } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MessageCircle, Check, Sparkles } from 'lucide-react-native';

// Types
export type EmojiType = 'frustrated' | 'neutral' | 'happy' | 'fire';

export interface QuickReflectionProps {
  /** Pre-selected emoji (for editing existing reflection) */
  selectedEmoji?: EmojiType | null;
  /** Pre-filled note text */
  noteText?: string;
  /** Whether the habit is completed today (shows reflection UI) */
  isCompletedToday: boolean;
  /** Whether to animate (for staggered entrance) */
  shouldAnimate?: boolean;
  /** Section index for staggered animation delay */
  sectionIndex?: number;
  /** Respect reduce motion accessibility setting */
  reduceMotion?: boolean;
  /** Callback when emoji is selected */
  onEmojiSelect?: (emoji: EmojiType) => void;
  /** Callback when note text changes */
  onNoteChange?: (text: string) => void;
  /** Callback when reflection is submitted */
  onSubmit?: (emoji: EmojiType, note?: string) => void;
}

// Constants
const MAX_NOTE_LENGTH = 500;
const STAGGER_DELAY = 80;
const SPRING_BOUNCY = { damping: 10, stiffness: 200 };
const SPRING_GENTLE = { damping: 15, stiffness: 150 };

// Emoji configuration
const EMOJI_OPTIONS: Array<{
  value: EmojiType;
  emoji: string;
  label: string;
  color: string;
}> = [
  { value: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'rose' },
  { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'stone' },
  { value: 'happy', emoji: '😊', label: 'Happy', color: 'amber' },
  { value: 'fire', emoji: '🔥', label: 'On Fire', color: 'emerald' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * EmojiButton - Individual emoji selection button
 */
function EmojiButton({
  option,
  isSelected,
  onPress,
  reduceMotion = false,
}: {
  option: (typeof EMOJI_OPTIONS)[number];
  isSelected: boolean;
  onPress: () => void;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(1);
  const backgroundOpacity = useSharedValue(isSelected ? 1 : 0);

  // Update background when selection changes
  useEffect(() => {
    if (reduceMotion) {
      backgroundOpacity.value = isSelected ? 1 : 0;
    } else {
      backgroundOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 150 });
    }
  }, [isSelected, reduceMotion]);

  const handlePress = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withSequence(
        withSpring(1.2, SPRING_BOUNCY),
        withSpring(1, SPRING_GENTLE)
      );
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${option.label} emoji`}
      accessibilityState={{ selected: isSelected }}
      style={animatedStyle}
      className="items-center justify-center"
    >
      <View className="relative">
        {/* Selection background */}
        <Animated.View
          style={backgroundStyle}
          className="absolute inset-0 -m-1 rounded-full bg-emerald-100 ring-2 ring-emerald-400"
        />
        {/* Emoji */}
        <Text className="text-3xl">{option.emoji}</Text>
        {/* Selection checkmark */}
        {isSelected && (
          <View className="absolute -bottom-1 -right-1 h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
            <Check size={10} color="white" strokeWidth={3} />
          </View>
        )}
      </View>
      {/* Label */}
      <Text
        className={`mt-1 text-xs ${
          isSelected ? 'font-medium text-emerald-700' : 'text-stone-500'
        }`}
      >
        {option.label}
      </Text>
    </AnimatedPressable>
  );
}

/**
 * PulsingIcon - Empty state icon with pulse animation
 */
function PulsingIcon({ reduceMotion = false }: { reduceMotion?: boolean }) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    const animate = () => {
      opacity.value = withTiming(0.5, { duration: 1000 }, () => {
        opacity.value = withTiming(1, { duration: 1000 }, () => {
          runOnJS(animate)();
        });
      });
      scale.value = withTiming(1.05, { duration: 1000 }, () => {
        scale.value = withTiming(1, { duration: 1000 });
      });
    };

    animate();
  }, [reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="h-12 w-12 items-center justify-center rounded-full bg-emerald-100"
    >
      <Sparkles size={24} className="text-emerald-500" />
    </Animated.View>
  );
}

/**
 * SectionCard - Wrapper with press animation
 */
function SectionCard({
  children,
  onPress,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!reduceMotion && onPress) {
      scale.value = withSpring(0.98, SPRING_GENTLE);
    }
  }, [reduceMotion, onPress]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion && onPress) {
      scale.value = withSpring(1, SPRING_GENTLE);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [reduceMotion, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <Animated.View
      style={animatedStyle}
      className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm border-l-4 border-l-emerald-400"
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Quick Reflection"
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

/**
 * CompletionCheckmark - Animated checkmark for completed section
 */
function CompletionCheckmark({
  sectionIndex = 0,
  reduceMotion = false,
}: {
  sectionIndex?: number;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      return;
    }

    const delay = sectionIndex * STAGGER_DELAY + 200;
    const timeout = setTimeout(() => {
      scale.value = withSequence(
        withSpring(1.2, SPRING_BOUNCY),
        withSpring(1, SPRING_GENTLE)
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [sectionIndex, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="h-6 w-6 items-center justify-center rounded-full bg-emerald-500"
    >
      <Check size={14} color="white" strokeWidth={3} />
    </Animated.View>
  );
}

/**
 * QuickReflection - Main component
 */
export function QuickReflection({
  selectedEmoji,
  noteText = '',
  isCompletedToday,
  shouldAnimate = true,
  sectionIndex = 0,
  reduceMotion = false,
  onEmojiSelect,
  onNoteChange,
  onSubmit,
}: QuickReflectionProps) {
  const [localEmoji, setLocalEmoji] = useState<EmojiType | null>(
    selectedEmoji ?? null
  );
  const [localNote, setLocalNote] = useState(noteText);
  const [showNoteInput, setShowNoteInput] = useState(!!noteText);

  // Animation values for staggered entrance
  const translateY = useSharedValue(shouldAnimate && !reduceMotion ? 24 : 0);
  const opacity = useSharedValue(shouldAnimate && !reduceMotion ? 0 : 1);

  // Staggered entrance animation
  useEffect(() => {
    if (!shouldAnimate || reduceMotion) return;

    const delay = sectionIndex * STAGGER_DELAY;
    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, SPRING_GENTLE);
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, sectionIndex, reduceMotion]);

  const entranceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Handle emoji selection
  const handleEmojiSelect = useCallback(
    (emoji: EmojiType) => {
      setLocalEmoji(emoji);
      onEmojiSelect?.(emoji);

      // Auto-show note input after first selection
      if (!showNoteInput) {
        setShowNoteInput(true);
      }
    },
    [onEmojiSelect, showNoteInput]
  );

  // Handle note change
  const handleNoteChange = useCallback(
    (text: string) => {
      if (text.length <= MAX_NOTE_LENGTH) {
        setLocalNote(text);
        onNoteChange?.(text);
      }
    },
    [onNoteChange]
  );

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (localEmoji) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSubmit?.(localEmoji, localNote || undefined);
      Keyboard.dismiss();
    }
  }, [localEmoji, localNote, onSubmit]);

  // If habit not completed, show empty/waiting state
  if (!isCompletedToday) {
    return (
      <Animated.View style={entranceStyle}>
        <SectionCard reduceMotion={reduceMotion}>
          <View className="flex-row items-center gap-3">
            <PulsingIcon reduceMotion={reduceMotion} />
            <View className="flex-1">
              <Text className="text-sm font-medium text-stone-700">
                Quick Reflection
              </Text>
              <Text className="text-xs text-stone-500">
                Complete your habit to reflect on how it went
              </Text>
            </View>
          </View>
        </SectionCard>
      </Animated.View>
    );
  }

  // Completed state - show emoji selector and optional note
  const hasReflection = !!selectedEmoji;

  return (
    <Animated.View style={entranceStyle}>
      <SectionCard reduceMotion={reduceMotion}>
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <MessageCircle size={16} className="text-emerald-600" />
            </View>
            <View>
              <Text className="text-sm font-semibold text-stone-800">
                How did it feel?
              </Text>
              <Text className="text-xs text-stone-500">
                Celebrate your win!
              </Text>
            </View>
          </View>
          {hasReflection && (
            <CompletionCheckmark
              sectionIndex={sectionIndex}
              reduceMotion={reduceMotion}
            />
          )}
        </View>

        {/* Emoji Selector */}
        <View className="mb-4 flex-row justify-around">
          {EMOJI_OPTIONS.map((option) => (
            <EmojiButton
              key={option.value}
              option={option}
              isSelected={localEmoji === option.value}
              onPress={() => handleEmojiSelect(option.value)}
              reduceMotion={reduceMotion}
            />
          ))}
        </View>

        {/* Note Input - shows after emoji selection */}
        {showNoteInput && localEmoji && (
          <View className="mt-2">
            <TextInput
              value={localNote}
              onChangeText={handleNoteChange}
              placeholder="Add a note about your session... (optional)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              maxLength={MAX_NOTE_LENGTH}
              className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700"
              style={{ minHeight: 80, textAlignVertical: 'top' }}
              accessibilityLabel="Reflection note input"
              accessibilityHint="Add an optional note about how the habit went"
            />
            {/* Character count */}
            <View className="mt-1 flex-row justify-between">
              <Text className="text-xs text-stone-400">
                {localNote.length}/{MAX_NOTE_LENGTH}
              </Text>
              {/* Submit button */}
              <Pressable
                onPress={handleSubmit}
                accessibilityRole="button"
                accessibilityLabel="Save reflection"
                className="rounded-full bg-emerald-500 px-4 py-1"
              >
                <Text className="text-xs font-medium text-white">Save</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Science callout */}
        <View className="mt-3 rounded-lg bg-emerald-50 p-2">
          <Text className="text-center text-xs text-emerald-700">
            Celebration wires habits - BJ Fogg
          </Text>
        </View>
      </SectionCard>
    </Animated.View>
  );
}

export default QuickReflection;
