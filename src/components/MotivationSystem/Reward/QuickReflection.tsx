/**
 * QuickReflection Component
 * Post-habit completion emoji rating + optional note
 *
 * Part of the Motivation System Reward flow
 * Story T6.2-T6.6: Quick Reflection
 *
 * Scientific Basis:
 * - BJ Fogg (Stanford, "Tiny Habits"): Celebration wires habits
 * - Journaling increases self-awareness and consistency
 * - Daylio (50M+ downloads) validates the reflection pattern
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Keyboard } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Smile, Plus, Check, MessageSquare } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';

export type EmojiType = 'frustrated' | 'neutral' | 'happy' | 'fire';

export interface QuickReflectionProps {
  /** Current reflection emoji (undefined if not set) */
  selectedEmoji?: EmojiType;
  /** Current reflection note (undefined if not set) */
  note?: string;
  /** Callback when emoji is selected */
  onEmojiSelect: (emoji: EmojiType) => void;
  /** Callback when note is changed */
  onNoteChange?: (note: string) => void;
  /** Callback when the reflection is submitted */
  onSubmit?: () => void;
  /** Whether to show the note input field */
  showNoteInput?: boolean;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
  /** Whether the component is in compact mode (for inline use) */
  compact?: boolean;
}

// Animation spring configs
const SPRING_BUTTON = { damping: 15, stiffness: 300 };
const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
const SPRING_GENTLE = { damping: 28, stiffness: 180, mass: 1.2 };
const STAGGER_DELAY = 80;

// Emoji configuration
const EMOJI_OPTIONS: { emoji: string; type: EmojiType; label: string }[] = [
  { emoji: '😤', type: 'frustrated', label: 'Frustrated' },
  { emoji: '😐', type: 'neutral', label: 'Neutral' },
  { emoji: '😊', type: 'happy', label: 'Happy' },
  { emoji: '🔥', type: 'fire', label: 'On Fire' },
];

/**
 * PulsingIcon Component for Empty State Icons
 * Wraps icons with subtle opacity + scale pulse animation
 */
function PulsingIcon({
  children,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  reduceMotion?: boolean;
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }

    // Create infinite pulse animation
    const pulseOpacity = () => {
      opacity.value = withTiming(0.5, { duration: 1000 }, (finished) => {
        if (finished) {
          opacity.value = withTiming(1, { duration: 1000 }, (finished2) => {
            if (finished2) {
              runOnJS(pulseOpacity)();
            }
          });
        }
      });
    };

    const pulseScale = () => {
      scale.value = withTiming(1.05, { duration: 1000 }, (finished) => {
        if (finished) {
          scale.value = withTiming(1, { duration: 1000 }, (finished2) => {
            if (finished2) {
              runOnJS(pulseScale)();
            }
          });
        }
      });
    };

    pulseOpacity();
    pulseScale();

    return () => {
      // Animation cleanup happens automatically when component unmounts
    };
  }, [reduceMotion, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * CompletionCheckmark Component
 * Animated checkmark badge that pops in when the section is filled
 */
function CompletionCheckmark({
  isVisible,
  sectionIndex,
  shouldAnimate,
  reduceMotion = false,
}: {
  isVisible: boolean;
  sectionIndex: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const BASE_CHECKMARK_DELAY = 600;
  const scale = useSharedValue(
    isVisible && shouldAnimate && !reduceMotion ? 0 : isVisible ? 1 : 0
  );
  const opacity = useSharedValue(
    isVisible && shouldAnimate && !reduceMotion ? 0 : isVisible ? 1 : 0
  );

  useEffect(() => {
    if (!isVisible) {
      scale.value = 0;
      opacity.value = 0;
      return;
    }

    if (!shouldAnimate || reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    // Calculate delay: section stagger + base checkmark delay
    const delay = sectionIndex * STAGGER_DELAY + BASE_CHECKMARK_DELAY;

    const timeout = setTimeout(() => {
      // Pop-in animation: 0 → 1.2 → 1 using Springs.bouncy
      scale.value = withSequence(
        withSpring(1.2, SPRING_BOUNCY),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
      opacity.value = withTiming(1, { duration: 150 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, shouldAnimate, reduceMotion, sectionIndex, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: -4,
          right: -4,
        },
      ]}
    >
      <View className="h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
        <Check className="text-white" size={12} strokeWidth={3} />
      </View>
    </Animated.View>
  );
}

/**
 * SectionCard Component for consistent styling with press animation
 */
function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={clsx(
        'rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50',
        className
      )}
      style={{
        shadowColor: '#78716c',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}

/**
 * AnimatedSection Component for staggered entrance animations
 */
function AnimatedSection({
  children,
  index,
  shouldAnimate,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  index: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const INITIAL_TRANSLATE_Y = 24;

  const translateY = useSharedValue(
    shouldAnimate && !reduceMotion ? INITIAL_TRANSLATE_Y : 0
  );
  const opacity = useSharedValue(shouldAnimate && !reduceMotion ? 0 : 1);

  useEffect(() => {
    if (!shouldAnimate || reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * STAGGER_DELAY;

    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, SPRING_GENTLE);
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * EmojiButton Component
 * Animated emoji selector button with selection state
 */
function EmojiButton({
  emoji,
  label,
  isSelected,
  onPress,
  reduceMotion = false,
}: {
  emoji: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(1);
  const selectionScale = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      selectionScale.value = isSelected ? 1 : 0;
    } else {
      selectionScale.value = isSelected
        ? withSequence(
            withSpring(1.15, SPRING_BOUNCY),
            withSpring(1, SPRING_BUTTON)
          )
        : withTiming(0, { duration: 150 });
    }
  }, [isSelected, reduceMotion, selectionScale]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, SPRING_BUTTON);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_BUTTON);
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const selectionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: selectionScale.value,
    transform: [{ scale: selectionScale.value }],
  }));

  return (
    <Pressable
      accessibilityLabel={`${label} emoji`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className="items-center justify-center"
        style={animatedStyle}
      >
        {/* Selection ring */}
        <Animated.View
          className="absolute h-14 w-14 rounded-full bg-emerald-100 border-2 border-emerald-400"
          style={selectionAnimatedStyle}
        />
        {/* Emoji */}
        <View
          className={clsx(
            'h-14 w-14 items-center justify-center rounded-full',
            isSelected ? '' : 'bg-stone-100'
          )}
        >
          <Text className="text-3xl">{emoji}</Text>
        </View>
        {/* Label */}
        <Text
          className={clsx(
            'mt-1 text-xs',
            isSelected ? 'font-medium text-emerald-700' : 'text-stone-500'
          )}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/**
 * QuickReflection - Main component
 *
 * Displays emoji selector with optional note field:
 * - Empty state: Pulsing smile icon with "How did it go?" prompt
 * - Emoji selection: 4 emoji options (😤 😐 😊 🔥)
 * - Optional note: Text input for additional context
 * - Emerald accent color styling
 */
export function QuickReflection({
  selectedEmoji,
  note = '',
  onEmojiSelect,
  onNoteChange,
  onSubmit,
  showNoteInput = true,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
  compact = false,
}: QuickReflectionProps) {
  const [localNote, setLocalNote] = useState(note);
  const hasSelection = !!selectedEmoji;

  // Update local note when prop changes
  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const handleNoteChange = useCallback(
    (text: string) => {
      setLocalNote(text);
      onNoteChange?.(text);
    },
    [onNoteChange]
  );

  const handleNoteSubmit = useCallback(() => {
    Keyboard.dismiss();
    onSubmit?.();
  }, [onSubmit]);

  if (compact) {
    // Compact mode for inline use (e.g., in completion flow)
    return (
      <View className="flex-row items-center justify-center gap-4">
        {EMOJI_OPTIONS.map((option) => (
          <EmojiButton
            key={option.type}
            emoji={option.emoji}
            label={option.label}
            isSelected={selectedEmoji === option.type}
            onPress={() => onEmojiSelect(option.type)}
            reduceMotion={reduceMotion}
          />
        ))}
      </View>
    );
  }

  return (
    <AnimatedSection
      index={sectionIndex}
      shouldAnimate={shouldAnimate}
      reduceMotion={reduceMotion}
    >
      <SectionCard className="border-l-4 border-l-emerald-400">
        <View className="flex-row items-start gap-3">
          {/* Icon with completion checkmark */}
          <View className="relative h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            {hasSelection ? (
              <Smile className="text-emerald-500" size={20} />
            ) : (
              <PulsingIcon reduceMotion={reduceMotion}>
                <Smile className="text-emerald-500" size={20} />
              </PulsingIcon>
            )}
            <CompletionCheckmark
              isVisible={hasSelection}
              sectionIndex={sectionIndex}
              shouldAnimate={shouldAnimate}
              reduceMotion={reduceMotion}
            />
          </View>

          {/* Content area */}
          <View className="flex-1">
            {/* Header */}
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="font-semibold text-stone-800">
                Quick Reflection
              </Text>
              {!hasSelection && (
                <View className="flex-row items-center gap-1">
                  <Plus className="text-emerald-600" size={12} />
                  <Text className="text-xs font-medium text-emerald-600">
                    Rate it
                  </Text>
                </View>
              )}
            </View>

            {/* Prompt text */}
            <Text className="mb-4 text-sm text-stone-500">
              How did completing this habit feel?
            </Text>

            {/* Emoji selector */}
            <View className="flex-row items-center justify-around mb-4">
              {EMOJI_OPTIONS.map((option) => (
                <EmojiButton
                  key={option.type}
                  emoji={option.emoji}
                  label={option.label}
                  isSelected={selectedEmoji === option.type}
                  onPress={() => onEmojiSelect(option.type)}
                  reduceMotion={reduceMotion}
                />
              ))}
            </View>

            {/* Optional note input */}
            {showNoteInput && hasSelection && (
              <View className="mt-2">
                <View className="flex-row items-center gap-2 mb-2">
                  <MessageSquare className="text-emerald-500" size={14} />
                  <Text className="text-xs font-medium text-stone-600">
                    Add a note (optional)
                  </Text>
                </View>
                <TextInput
                  className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-700 border border-stone-200"
                  placeholder="What made it great? Any challenges?"
                  placeholderTextColor="#a8a29e"
                  value={localNote}
                  onChangeText={handleNoteChange}
                  onSubmitEditing={handleNoteSubmit}
                  multiline
                  maxLength={500}
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
                <View className="flex-row justify-between mt-1">
                  <Text className="text-xs text-stone-400">
                    Press return to save
                  </Text>
                  <Text className="text-xs text-stone-400">
                    {localNote.length}/500
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </SectionCard>
    </AnimatedSection>
  );
}

export default QuickReflection;
