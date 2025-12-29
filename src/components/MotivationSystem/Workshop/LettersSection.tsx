/**
 * LettersSection Component
 * Letters to Self - Time-locked messages from past self to future self
 *
 * Part of the Motivation System Workshop tab
 * Story T11.2-T11.8: Letters to Self feature
 *
 * Scientific Basis:
 * - Temporal self-continuity: Connecting with future self increases self-control
 * - Delayed gratification psychology (Mischel's marshmallow studies)
 *
 * Business Model:
 * - Premium feature: creates anticipation, unique feature, emotional depth
 * - Users pay for emotional experiences (Calm model)
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  Mail,
  MailOpen,
  Plus,
  Check,
  X,
  Lock,
  Unlock,
  Calendar,
  Sparkles,
  Clock,
  ChevronRight,
  Heart,
  Quote,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { PulsingIcon, CompletionCheckmark } from '../../animations';

export interface LetterSummary {
  id: string;
  title?: string;
  content: string;
  createdAt: number;
  unlockAt: number;
  isRead: boolean;
}

export interface LettersSectionProps {
  /** List of existing letters */
  letters: LetterSummary[];
  /** Number of letters (for analytics) */
  letterCount: number;
  /** Whether user has premium access */
  isPremium: boolean;
  /** Callback when a new letter is saved */
  onSaveLetter: (
    content: string,
    unlockDays: number,
    title?: string
  ) => Promise<void>;
  /** Callback when user taps to view all letters */
  onViewAllLetters: () => void;
  /** Callback when user taps a letter to read it (deprecated - use internal modal) */
  onReadLetter: (letterId: string) => void;
  /** Callback when a letter is marked as read */
  onMarkAsRead?: (letterId: string) => void;
  /** Callback when user hits premium limit */
  onPremiumRequired: () => void;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
  /** Optional habit name to display in letter reading modal */
  habitName?: string;
}

// Animation spring configs
const SPRING_BUTTON = { damping: 15, stiffness: 300 };
const SPRING_GENTLE = { damping: 28, mass: 1.2, stiffness: 180 };

// Content limits (matching Convex validation)
const MAX_CONTENT_LENGTH = 5000;
const MAX_TITLE_LENGTH = 100;

// Unlock duration options (in days)
export const UNLOCK_DURATION_OPTIONS = [
  { description: 'Quick motivation boost', label: '1 Week', value: 7 },
  { description: 'Short-term reflection', label: '2 Weeks', value: 14 },
  { description: 'Monthly milestone', label: '1 Month', value: 30 },
  { description: 'Long-term commitment', label: '3 Months', value: 90 },
] as const;

/**
 * SectionCard Component for consistent styling with press animation
 */
function SectionCard({
  children,
  className,
  onPress,
  accessibilityLabel,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    elevation: elevation.value,
    shadowOffset: {
      height: interpolate(elevation.value, [1, 2], [1, 2]),
      width: 0,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [2, 4]),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.04, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.08, SPRING_BUTTON);
    elevation.value = withSpring(2, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  if (onPress) {
    return (
      <Animated.View style={[animatedStyle, { shadowColor: '#78716c' }]}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          accessibilityState={{ disabled }}
          className={clsx('rounded-2xl bg-white p-4', className)}
          disabled={disabled}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50',
        className
      )}
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
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * UnlockDurationPicker Component
 * Allows user to select when the letter will unlock
 */
function UnlockDurationPicker({
  selectedDays,
  onSelectDays,
}: {
  selectedDays: number;
  onSelectDays: (days: number) => void;
}) {
  return (
    <View className='gap-2'>
      {UNLOCK_DURATION_OPTIONS.map((option) => {
        const isSelected = selectedDays === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityLabel={`Unlock in ${option.label}`}
            accessibilityRole='radio'
            accessibilityState={{ selected: isSelected }}
            className={clsx(
              'flex-row items-center justify-between rounded-xl border-2 px-4 py-3',
              isSelected
                ? 'border-violet-500 bg-violet-50'
                : 'border-stone-200 bg-white'
            )}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelectDays(option.value);
            }}
          >
            <View className='flex-row items-center gap-3'>
              <View
                className={clsx(
                  'h-8 w-8 items-center justify-center rounded-full',
                  isSelected ? 'bg-violet-500' : 'bg-stone-100'
                )}
              >
                <Clock
                  className={isSelected ? 'text-white' : 'text-stone-400'}
                  size={16}
                />
              </View>
              <View>
                <Text
                  className={clsx(
                    'font-semibold',
                    isSelected ? 'text-violet-700' : 'text-stone-700'
                  )}
                >
                  {option.label}
                </Text>
                <Text className='text-xs text-stone-500'>
                  {option.description}
                </Text>
              </View>
            </View>
            {isSelected && (
              <View className='h-6 w-6 items-center justify-center rounded-full bg-violet-500'>
                <Check className='text-white' size={14} strokeWidth={3} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * WriteLetterModal Component
 * Modal for writing a new letter to self
 */
function WriteLetterModal({
  visible,
  onClose,
  onSave,
  isSaving,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (
    content: string,
    unlockDays: number,
    title?: string
  ) => Promise<void>;
  isSaving: boolean;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDays, setUnlockDays] = useState(7); // Default to 1 week
  const [step, setStep] = useState<'write' | 'schedule'>('write');

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setTitle('');
      setContent('');
      setUnlockDays(7);
      setStep('write');
    }
  }, [visible]);

  const canProceedToSchedule = content.trim().length >= 10;
  const canSave = content.trim().length >= 10 && unlockDays > 0;

  const handleNext = useCallback(() => {
    if (!canProceedToSchedule) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setStep('schedule');
  }, [canProceedToSchedule]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('write');
  }, []);

  const handleSave = useCallback(async () => {
    if (!canSave || isSaving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await onSave(content.trim(), unlockDays, title.trim() || undefined);
      onClose();
    } catch (error) {
      // Error handling is done in parent
      console.error('Failed to save letter:', error);
    }
  }, [canSave, isSaving, content, unlockDays, title, onSave, onClose]);

  // Calculate unlock date for preview
  const unlockDate = new Date(Date.now() + unlockDays * 24 * 60 * 60 * 1000);
  const unlockDateString = unlockDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 bg-white'
      >
        {/* Header */}
        <View className='flex-row items-center justify-between border-b border-stone-100 px-4 pb-4 pt-6'>
          <View className='flex-row items-center gap-3'>
            <View className='h-10 w-10 items-center justify-center rounded-xl bg-violet-100'>
              <Mail className='text-violet-600' size={20} />
            </View>
            <View>
              <Text className='text-lg font-bold text-stone-800'>
                {step === 'write' ? 'Write Your Letter' : 'Schedule Delivery'}
              </Text>
              <Text className='text-xs text-stone-500'>
                {step === 'write'
                  ? 'A message to your future self'
                  : 'When should this letter unlock?'}
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityLabel='Close'
            className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
            onPress={onClose}
          >
            <X className='text-stone-500' size={20} />
          </Pressable>
        </View>

        {step === 'write' ? (
          /* Writing Step */
          <ScrollView
            className='flex-1'
            contentContainerClassName='p-4 pb-8'
            keyboardShouldPersistTaps='handled'
          >
            {/* Science callout */}
            <View className='mb-4 flex-row items-start gap-2 rounded-xl bg-violet-50 p-3'>
              <Sparkles className='mt-0.5 text-violet-500' size={16} />
              <Text className='flex-1 text-xs leading-relaxed text-violet-700'>
                Research shows that connecting with your future self increases
                self-control and long-term thinking. Write as if you're talking
                to a close friend.
              </Text>
            </View>

            {/* Title input */}
            <View className='mb-4'>
              <Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400'>
                Title (optional)
              </Text>
              <TextInput
                accessibilityLabel='Letter title'
                className='rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-base text-stone-800'
                maxLength={MAX_TITLE_LENGTH}
                placeholder='e.g., "Keep Going" or "Remember Why"'
                placeholderTextColor='#a8a29e'
                value={title}
                onChangeText={setTitle}
              />
              <Text className='mt-1 text-right text-xs text-stone-400'>
                {title.length}/{MAX_TITLE_LENGTH}
              </Text>
            </View>

            {/* Content input */}
            <View>
              <Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400'>
                Your Letter
              </Text>
              <TextInput
                multiline
                accessibilityLabel='Letter content'
                className='min-h-[200px] rounded-xl border-2 border-violet-200 bg-white px-4 py-3 text-base text-stone-800'
                maxLength={MAX_CONTENT_LENGTH}
                placeholder="Dear Future Me,

I'm writing this because..."
                placeholderTextColor='#a8a29e'
                textAlignVertical='top'
                value={content}
                onChangeText={setContent}
              />
              <View className='mt-2 flex-row items-center justify-between'>
                <Text className='text-xs text-stone-400'>
                  {content.length < 10
                    ? `${10 - content.length} more characters needed`
                    : ''}
                </Text>
                <Text
                  className={clsx(
                    'text-xs font-semibold',
                    content.length >= MAX_CONTENT_LENGTH
                      ? 'text-rose-500'
                      : content.length >= MAX_CONTENT_LENGTH * 0.9
                        ? 'text-amber-500'
                        : 'text-stone-400'
                  )}
                >
                  {content.length}/{MAX_CONTENT_LENGTH}
                </Text>
              </View>
            </View>

            {/* Writing prompts */}
            <View className='mt-6'>
              <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
                Writing Prompts
              </Text>
              <View className='gap-2'>
                {[
                  'What will you feel when you achieve this habit?',
                  'What would you tell yourself on a hard day?',
                  'Why did you start this journey?',
                  'What are you most proud of right now?',
                ].map((prompt, index) => (
                  <View
                    key={index}
                    className='flex-row items-start gap-2 rounded-lg bg-stone-50 px-3 py-2'
                  >
                    <Text className='text-violet-500'>•</Text>
                    <Text className='flex-1 text-xs text-stone-600'>
                      {prompt}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          /* Scheduling Step */
          <ScrollView className='flex-1' contentContainerClassName='p-4 pb-8'>
            {/* Back button */}
            <Pressable
              accessibilityLabel='Go back to writing'
              className='mb-4 flex-row items-center gap-1'
              onPress={handleBack}
            >
              <ChevronRight className='rotate-180 text-violet-600' size={16} />
              <Text className='text-sm font-medium text-violet-600'>
                Back to letter
              </Text>
            </Pressable>

            {/* Preview of letter */}
            <View className='mb-6 rounded-xl border border-violet-200 bg-violet-50 p-4'>
              <View className='mb-2 flex-row items-center gap-2'>
                <Mail className='text-violet-500' size={16} />
                <Text className='font-semibold text-violet-700'>
                  {title || 'Letter to Future Self'}
                </Text>
              </View>
              <Text className='text-sm text-stone-600' numberOfLines={3}>
                {content}
              </Text>
            </View>

            {/* Unlock duration picker */}
            <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
              When to unlock
            </Text>
            <UnlockDurationPicker
              selectedDays={unlockDays}
              onSelectDays={setUnlockDays}
            />

            {/* Unlock date preview */}
            <View className='mt-4 flex-row items-center gap-2 rounded-xl bg-amber-50 p-3'>
              <Calendar className='text-amber-600' size={18} />
              <View className='flex-1'>
                <Text className='text-xs font-medium text-amber-800'>
                  Unlocks on:
                </Text>
                <Text className='text-sm font-semibold text-amber-900'>
                  {unlockDateString}
                </Text>
              </View>
              <Lock className='text-amber-500' size={16} />
            </View>

            {/* Explanation */}
            <Text className='mt-4 text-center text-xs text-stone-500'>
              Your letter will be locked until this date. You'll receive a
              notification when it's ready to read.
            </Text>
          </ScrollView>
        )}

        {/* Footer with action button */}
        <View className='border-t border-stone-100 px-4 pb-8 pt-4'>
          {step === 'write' ? (
            <Pressable
              accessibilityLabel='Continue to schedule'
              accessibilityRole='button'
              accessibilityState={{ disabled: !canProceedToSchedule }}
              className={clsx(
                'flex-row items-center justify-center gap-2 rounded-xl py-4',
                canProceedToSchedule ? 'bg-violet-500' : 'bg-stone-200'
              )}
              disabled={!canProceedToSchedule}
              onPress={handleNext}
            >
              <Text
                className={clsx(
                  'text-base font-semibold',
                  canProceedToSchedule ? 'text-white' : 'text-stone-400'
                )}
              >
                Continue
              </Text>
              <ChevronRight
                className={
                  canProceedToSchedule ? 'text-white' : 'text-stone-400'
                }
                size={18}
              />
            </Pressable>
          ) : (
            <Pressable
              accessibilityLabel='Save and lock letter'
              accessibilityRole='button'
              accessibilityState={{ disabled: !canSave || isSaving }}
              className={clsx(
                'flex-row items-center justify-center gap-2 rounded-xl py-4',
                canSave && !isSaving ? 'bg-violet-500' : 'bg-stone-200'
              )}
              disabled={!canSave || isSaving}
              onPress={handleSave}
            >
              <Lock
                className={
                  canSave && !isSaving ? 'text-white' : 'text-stone-400'
                }
                size={18}
              />
              <Text
                className={clsx(
                  'text-base font-semibold',
                  canSave && !isSaving ? 'text-white' : 'text-stone-400'
                )}
              >
                {isSaving ? 'Saving...' : 'Seal & Lock Letter'}
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/**
 * Full letter data for reading (includes all fields from Convex)
 */
export interface LetterData {
  id: string;
  title?: string;
  content: string;
  createdAt: number;
  unlockAt: number;
  isRead: boolean;
  habitName?: string;
}

/**
 * ReadLetterModal Component
 * Modal for reading an unlocked letter from past self
 *
 * Features:
 * - Emotional "time capsule" reveal experience
 * - Unlock celebration animation for newly unlocked letters
 * - Quote-style content display with serif-like styling
 * - Information about when it was written and locked
 * - Automatic mark-as-read on open
 *
 * Scientific Basis:
 * - Temporal self-continuity: Reading past self messages strengthens
 *   connection to future self, increasing self-control
 */
function ReadLetterModal({
  visible,
  letter,
  onClose,
  onMarkAsRead,
  reduceMotion = false,
}: {
  visible: boolean;
  letter: LetterData | null;
  onClose: () => void;
  onMarkAsRead: (letterId: string) => void;
  reduceMotion?: boolean;
}) {
  // Animation values
  const envelopeScale = useSharedValue(0.8);
  const envelopeOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const sparkleScale = useSharedValue(0);
  const [showContent, setShowContent] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Check if letter was just unlocked (within last hour)
  const wasJustUnlocked = letter
    ? Date.now() - letter.unlockAt < 60 * 60 * 1000 && !letter.isRead
    : false;

  // Calculate time since letter was written
  const daysSinceWritten = letter
    ? Math.floor((Date.now() - letter.createdAt) / (24 * 60 * 60 * 1000))
    : 0;

  // Format the date when letter was written
  const writtenDateString = letter
    ? new Date(letter.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  // Reset and play entrance animation when modal opens
  useEffect(() => {
    if (visible && letter) {
      // Reset state
      setShowContent(false);
      setAnimationComplete(false);

      if (reduceMotion) {
        // Skip animations for accessibility
        setShowContent(true);
        setAnimationComplete(true);
        envelopeScale.value = 1;
        envelopeOpacity.value = 1;
        contentOpacity.value = 1;
        contentTranslateY.value = 0;
        sparkleScale.value = 1;

        // Mark as read immediately
        if (!letter.isRead) {
          onMarkAsRead(letter.id);
        }
        return;
      }

      // Start entrance animation
      envelopeScale.value = 0.8;
      envelopeOpacity.value = 0;

      // Animate envelope reveal
      envelopeScale.value = withSpring(1, SPRING_BOUNCY);
      envelopeOpacity.value = withTiming(1, { duration: 400 });

      // If just unlocked, show celebration sparkles
      if (wasJustUnlocked) {
        setTimeout(() => {
          sparkleScale.value = withSequence(
            withSpring(1.2, SPRING_BOUNCY),
            withSpring(1, { damping: 15, stiffness: 200 })
          );
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 300);
      }

      // Reveal content after envelope animation
      setTimeout(
        () => {
          setShowContent(true);
          contentOpacity.value = withTiming(1, { duration: 500 });
          contentTranslateY.value = withSpring(0, SPRING_GENTLE);

          // Mark as read after reveal
          if (!letter.isRead) {
            onMarkAsRead(letter.id);
          }

          setTimeout(() => {
            setAnimationComplete(true);
          }, 500);
        },
        wasJustUnlocked ? 800 : 400
      );
    }
  }, [visible, letter?.id]);

  // Animated styles
  const envelopeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: envelopeOpacity.value,
    transform: [{ scale: envelopeScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sparkleScale.value,
    transform: [{ scale: sparkleScale.value }],
  }));

  // Don't render if no letter data
  if (!letter) return null;

  // Check if letter is still locked (shouldn't happen, but safeguard)
  const isLocked = letter.unlockAt > Date.now();

  return (
    <Modal
      animationType='fade'
      presentationStyle='fullScreen'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-gradient-to-b from-violet-50 to-white'>
        {/* Header */}
        <View className='flex-row items-center justify-between px-4 pb-4 pt-14'>
          <View className='flex-1' />
          <View className='flex-row items-center gap-2'>
            <Animated.View style={envelopeAnimatedStyle}>
              <View className='h-10 w-10 items-center justify-center rounded-xl bg-violet-100'>
                <MailOpen className='text-violet-600' size={22} />
              </View>
            </Animated.View>
            <Text className='text-lg font-bold text-stone-800'>
              {letter.title || 'Letter from Past Self'}
            </Text>
          </View>
          <View className='flex-1 items-end'>
            <Pressable
              accessibilityLabel='Close letter'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
            >
              <X className='text-stone-500' size={20} />
            </Pressable>
          </View>
        </View>

        {/* Locked State (error) */}
        {isLocked ? (
          <View className='flex-1 items-center justify-center px-8'>
            <View className='h-20 w-20 items-center justify-center rounded-full bg-stone-100'>
              <Lock className='text-stone-400' size={36} />
            </View>
            <Text className='mt-4 text-center text-lg font-semibold text-stone-600'>
              This letter is still locked
            </Text>
            <Text className='mt-2 text-center text-sm text-stone-500'>
              It will unlock on{' '}
              {new Date(letter.unlockAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        ) : (
          /* Unlocked Content */
          <ScrollView
            className='flex-1'
            contentContainerClassName='px-5 pb-12'
            showsVerticalScrollIndicator={false}
          >
            {/* Time capsule reveal animation */}
            {wasJustUnlocked && !animationComplete && (
              <View className='mb-6 items-center'>
                <Animated.View
                  className='flex-row items-center gap-2 rounded-full bg-amber-50 px-4 py-2'
                  style={[sparkleAnimatedStyle]}
                >
                  <Unlock className='text-amber-500' size={16} />
                  <Text className='font-semibold text-amber-700'>
                    Just Unlocked!
                  </Text>
                  <Sparkles className='text-amber-500' size={16} />
                </Animated.View>
              </View>
            )}

            {/* Letter metadata */}
            <Animated.View
              className='mb-6'
              style={showContent ? contentAnimatedStyle : { opacity: 0 }}
            >
              <View className='flex-row items-center justify-center gap-3'>
                <View className='flex-row items-center gap-1.5'>
                  <Calendar className='text-violet-400' size={14} />
                  <Text className='text-xs text-stone-500'>
                    Written {writtenDateString}
                  </Text>
                </View>
                <Text className='text-stone-300'>•</Text>
                <Text className='text-xs text-stone-500'>
                  {daysSinceWritten} day{daysSinceWritten === 1 ? '' : 's'} ago
                </Text>
              </View>
            </Animated.View>

            {/* Letter content with quote styling */}
            <Animated.View
              style={showContent ? contentAnimatedStyle : { opacity: 0 }}
            >
              {/* Opening quote decoration */}
              <View className='mb-4 items-center'>
                <Quote
                  className='rotate-180 text-violet-200'
                  fill='#ddd6fe'
                  size={32}
                />
              </View>

              {/* Letter content */}
              <View className='rounded-2xl bg-white p-6 shadow-sm shadow-stone-200/60'>
                <Text
                  className='text-base leading-7 text-stone-700'
                  style={{ fontFamily: 'serif' }}
                >
                  {letter.content}
                </Text>
              </View>

              {/* Closing quote decoration */}
              <View className='mt-4 items-center'>
                <Quote className='text-violet-200' fill='#ddd6fe' size={32} />
              </View>

              {/* Signature line */}
              <View className='mt-6 items-center'>
                <View className='h-px w-16 bg-violet-200' />
                <Text className='mt-3 text-sm italic text-stone-500'>
                  — Your Past Self
                </Text>
                {letter.habitName && (
                  <Text className='mt-1 text-xs text-violet-500'>
                    For your {letter.habitName} journey
                  </Text>
                )}
              </View>
            </Animated.View>

            {/* Motivational footer */}
            <Animated.View
              className='mt-8'
              style={showContent ? contentAnimatedStyle : { opacity: 0 }}
            >
              <View className='flex-row items-start gap-3 rounded-xl bg-gradient-to-r from-violet-50 to-rose-50 p-4'>
                <View className='h-8 w-8 items-center justify-center rounded-full bg-violet-100'>
                  <Heart className='text-violet-500' fill='#8b5cf6' size={16} />
                </View>
                <View className='flex-1'>
                  <Text className='text-sm font-medium text-violet-700'>
                    This is the voice that made the commitment
                  </Text>
                  <Text className='mt-1 text-xs text-stone-500'>
                    The person who wrote this believed in your ability to
                    persist. Honor that belief.
                  </Text>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        )}

        {/* Footer */}
        <View className='border-t border-stone-100 px-4 pb-10 pt-4'>
          <Pressable
            accessibilityLabel='Close and return'
            accessibilityRole='button'
            className='flex-row items-center justify-center gap-2 rounded-xl bg-violet-500 py-4'
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onClose();
            }}
          >
            <Check className='text-white' size={20} />
            <Text className='text-base font-semibold text-white'>
              {isLocked ? 'Close' : 'Done Reading'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/**
 * LetterItem Component
 * Individual letter display with locked/unlocked state
 */
function LetterItem({
  letter,
  onPress,
}: {
  letter: LetterSummary;
  onPress: () => void;
}) {
  const now = Date.now();
  const isLocked = letter.unlockAt > now;
  const daysUntilUnlock = Math.ceil(
    (letter.unlockAt - now) / (24 * 60 * 60 * 1000)
  );
  const isNew = !letter.isRead && !isLocked;

  return (
    <Pressable
      accessibilityLabel={
        isLocked
          ? `Locked letter: ${letter.title || 'Letter'}, unlocks in ${daysUntilUnlock} days`
          : `${isNew ? 'Unread letter' : 'Letter'}: ${letter.title || 'Letter'}`
      }
      accessibilityRole='button'
      className={clsx(
        'flex-row items-center gap-3 rounded-xl p-3',
        isLocked ? 'bg-stone-50' : isNew ? 'bg-violet-50' : 'bg-stone-50'
      )}
      onPress={onPress}
    >
      <View
        className={clsx(
          'h-10 w-10 items-center justify-center rounded-full',
          isLocked ? 'bg-stone-200' : isNew ? 'bg-violet-500' : 'bg-violet-100'
        )}
      >
        {isLocked ? (
          <Lock className='text-stone-500' size={18} />
        ) : (
          <Mail
            className={isNew ? 'text-white' : 'text-violet-600'}
            size={18}
          />
        )}
      </View>
      <View className='flex-1'>
        <Text
          className={clsx(
            'font-medium',
            isLocked ? 'text-stone-500' : 'text-stone-700'
          )}
          numberOfLines={1}
        >
          {letter.title || 'Letter to Future Self'}
        </Text>
        <Text className='text-xs text-stone-400'>
          {isLocked
            ? `Unlocks in ${daysUntilUnlock} day${daysUntilUnlock === 1 ? '' : 's'}`
            : isNew
              ? 'Ready to read!'
              : `Read ${formatRelativeTime(letter.unlockAt)}`}
        </Text>
      </View>
      {isNew && <View className='h-2.5 w-2.5 rounded-full bg-violet-500' />}
    </Pressable>
  );
}

/**
 * Format timestamp as relative time
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * LettersList Component
 * Displays list of existing letters
 */
function LettersList({
  letters,
  onViewAllLetters,
  onReadLetter,
}: {
  letters: LetterSummary[];
  onViewAllLetters: () => void;
  onReadLetter: (letterId: string) => void;
}) {
  if (letters.length === 0) {
    return null;
  }

  const displayLetters = letters.slice(0, 3);
  const hasMore = letters.length > 3;

  return (
    <View className='mt-4 border-t border-stone-100 pt-4'>
      <View className='mb-2 flex-row items-center justify-between'>
        <Text className='text-sm font-medium text-stone-600'>
          Your Letters ({letters.length})
        </Text>
        {hasMore && (
          <Pressable onPress={onViewAllLetters}>
            <Text className='text-xs font-medium text-violet-600'>
              View All
            </Text>
          </Pressable>
        )}
      </View>

      <View className='gap-2'>
        {displayLetters.map((letter) => (
          <LetterItem
            key={letter.id}
            letter={letter}
            onPress={() => onReadLetter(letter.id)}
          />
        ))}
      </View>
    </View>
  );
}

/**
 * LettersSection - Main component
 *
 * Displays Letters to Self section with:
 * - Empty state: Pulsing envelope icon with "Write Letter" CTA
 * - Filled state: List of letters with locked/unlocked states
 * - Premium badge and gating
 * - Violet accent color
 */
export function LettersSection({
  letters,
  letterCount,
  isPremium,
  onSaveLetter,
  onViewAllLetters,
  onReadLetter,
  onMarkAsRead,
  onPremiumRequired,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
  habitName,
}: LettersSectionProps) {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const hasLetters = letterCount > 0;
  const unreadCount = letters.filter(
    (l) => !l.isRead && l.unlockAt <= Date.now()
  ).length;

  const handleOpenWriteModal = useCallback(() => {
    if (!isPremium) {
      onPremiumRequired();
      return;
    }
    setIsWriteModalOpen(true);
  }, [isPremium, onPremiumRequired]);

  const handleOpenReadModal = useCallback(
    (letterId: string) => {
      const letter = letters.find((l) => l.id === letterId);
      if (!letter) return;

      // Convert to LetterData format with habitName
      const letterData: LetterData = {
        ...letter,
        habitName,
      };

      setSelectedLetter(letterData);
      setIsReadModalOpen(true);

      // Also notify parent (for backwards compatibility)
      onReadLetter(letterId);
    },
    [letters, habitName, onReadLetter]
  );

  const handleCloseReadModal = useCallback(() => {
    setIsReadModalOpen(false);
    // Clear selected letter after animation completes
    setTimeout(() => setSelectedLetter(null), 300);
  }, []);

  const handleMarkAsRead = useCallback(
    (letterId: string) => {
      onMarkAsRead?.(letterId);
    },
    [onMarkAsRead]
  );

  const handleSaveLetter = useCallback(
    async (content: string, unlockDays: number, title?: string) => {
      setIsSaving(true);
      try {
        await onSaveLetter(content, unlockDays, title);
      } finally {
        setIsSaving(false);
      }
    },
    [onSaveLetter]
  );

  const handleSectionPress = useCallback(() => {
    if (!isPremium) {
      onPremiumRequired();
    }
  }, [isPremium, onPremiumRequired]);

  return (
    <>
      <AnimatedSection
        index={sectionIndex}
        reduceMotion={reduceMotion}
        shouldAnimate={shouldAnimate}
      >
        <SectionCard
          accessibilityLabel={
            hasLetters
              ? 'Letters to self'
              : 'Write a letter to your future self'
          }
          className='border-l-4 border-l-violet-400'
          onPress={handleSectionPress}
        >
          <View className='flex-row items-start gap-3'>
            {/* Icon with completion checkmark */}
            <View className='relative h-10 w-10 items-center justify-center rounded-xl bg-violet-100'>
              {hasLetters ? (
                <Mail className='text-violet-500' size={20} />
              ) : (
                <PulsingIcon reduceMotion={reduceMotion}>
                  <Mail className='text-violet-500' size={20} />
                </PulsingIcon>
              )}
              <CompletionCheckmark
                isVisible={hasLetters}
                reduceMotion={reduceMotion}
                sectionIndex={sectionIndex}
                shouldAnimate={shouldAnimate}
              />
            </View>

            {/* Content area */}
            <View className='flex-1'>
              <View className='mb-1 flex-row items-center justify-between'>
                <View className='flex-row items-center gap-2'>
                  <Text className='font-semibold text-stone-800'>
                    Letters to Self
                  </Text>
                  {!isPremium && (
                    <View className='rounded-full bg-amber-100 px-2 py-0.5'>
                      <Text className='text-xs font-medium text-amber-700'>
                        PRO
                      </Text>
                    </View>
                  )}
                </View>
                {hasLetters && unreadCount > 0 && (
                  <View className='rounded-full bg-violet-500 px-2 py-0.5'>
                    <Text className='text-xs font-semibold text-white'>
                      {unreadCount} new
                    </Text>
                  </View>
                )}
                {!hasLetters && (
                  <View className='flex-row items-center gap-1'>
                    <Plus className='text-violet-600' size={12} />
                    <Text className='text-xs font-medium text-violet-600'>
                      Write
                    </Text>
                  </View>
                )}
              </View>

              {/* Description */}
              {!hasLetters && (
                <Text className='text-sm text-stone-500'>
                  Send motivation to your future self
                </Text>
              )}

              {/* Science tip */}
              {!hasLetters && (
                <View className='mt-2 flex-row items-start gap-1.5 rounded-lg bg-violet-50 px-2 py-1.5'>
                  <Sparkles className='mt-0.5 text-violet-500' size={12} />
                  <Text className='flex-1 text-xs text-violet-700'>
                    Time-locked messages create powerful emotional anchors
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Write letter button */}
          {isPremium && (
            <View className='mt-4 items-center'>
              <Pressable
                accessibilityLabel='Write a new letter'
                accessibilityRole='button'
                className='flex-row items-center gap-2 rounded-full bg-violet-500 px-4 py-2'
                onPress={handleOpenWriteModal}
              >
                <Mail className='text-white' size={16} />
                <Text className='font-medium text-white'>
                  {hasLetters ? 'Write Another' : 'Write Your First Letter'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* List of existing letters */}
          <LettersList
            letters={letters}
            onReadLetter={handleOpenReadModal}
            onViewAllLetters={onViewAllLetters}
          />
        </SectionCard>
      </AnimatedSection>

      {/* Write Letter Modal */}
      <WriteLetterModal
        isSaving={isSaving}
        visible={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSave={handleSaveLetter}
      />

      {/* Read Letter Modal */}
      <ReadLetterModal
        letter={selectedLetter}
        reduceMotion={reduceMotion}
        visible={isReadModalOpen}
        onClose={handleCloseReadModal}
        onMarkAsRead={handleMarkAsRead}
      />
    </>
  );
}

export { LetterData };
export default LettersSection;
