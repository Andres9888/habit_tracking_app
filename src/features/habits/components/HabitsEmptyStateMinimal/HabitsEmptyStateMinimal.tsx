/**
 * HabitsEmptyStateMinimal - Main Component
 *
 * Ultra-minimal empty state design focused on a single question flow.
 * Ask what habit the user wants, let them type or tap a suggestion,
 * and create it immediately.
 *
 * Reference: docs/specs/empty-habit-screen/minimal-redesign.md
 */

import { useCallback, useRef, useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { useKeyboardVisible } from '../../../../hooks/useKeyboardVisible';
import { AnimatedEntrance } from './AnimatedEntrance';
import { ENTRANCE_DELAYS, KEYBOARD_LAYOUT } from './animations';
import { COLORS, COPY } from './constants';
import { CtaButton } from './CtaButton';
import { ErrorMessage } from './ErrorMessage';
import { HabitInput } from './HabitInput';
import { HeroIcon } from './HeroIcon';
import { LoadingSkeleton } from './LoadingSkeleton';
import { SecondaryLinks } from './SecondaryLinks';
import { SuccessState } from './SuccessState';
import { SuggestionChips } from './SuggestionChips';
import type { HabitsEmptyStateMinimalProps, SuggestionChip } from './types';

/**
 * Minimal empty state for habits screen
 *
 * Provides a streamlined flow for creating the first habit:
 * 1. Hero icon with breathing animation
 * 2. Question headline
 * 3. Text input or suggestion chips
 * 4. Primary CTA button
 * 5. Success celebration on creation
 */
export function HabitsEmptyStateMinimal({
  isLoading = false,
  onQuickCreateHabit,
  openTemplatesScreen,
  openCreateHabitScreen,
  onSuccessTransitionComplete,
}: HabitsEmptyStateMinimalProps) {
  const inputRef = useRef<TextInput>(null);
  const { triggerSuccess } = useHapticFeedback();
  const { isKeyboardVisible } = useKeyboardVisible();
  const shouldReduceMotion = useReducedMotion();
  const insets = useSafeAreaInsets();

  // Extract bottom inset for use in worklet (capture at mount)
  const bottomInset = insets.bottom;

  // Debug: Log the inset value
  console.log(
    '[HabitsEmptyStateMinimal] Safe area bottom inset:',
    bottomInset,
    'Keyboard visible:',
    isKeyboardVisible
  );

  // Timing config for keyboard-aware transitions
  const timingConfig = {
    duration: shouldReduceMotion ? 0 : KEYBOARD_LAYOUT.transitionDuration,
    easing: Easing.out(Easing.ease),
  };

  // Animated styles for keyboard-aware compact mode
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    justifyContent: isKeyboardVisible ? 'flex-start' : 'center',
    paddingBottom: withTiming(
      isKeyboardVisible ? 0 : bottomInset + 20, // +20 for breathing room above safe area
      timingConfig
    ),
    paddingTop: withTiming(
      isKeyboardVisible ? KEYBOARD_LAYOUT.topPadding : 0,
      timingConfig
    ),
  }));

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(
          isKeyboardVisible ? KEYBOARD_LAYOUT.compactHeroSize / 80 : 1,
          timingConfig
        ),
      },
    ],
  }));

  const headlineAnimatedStyle = useAnimatedStyle(() => ({
    fontSize: withTiming(
      isKeyboardVisible ? KEYBOARD_LAYOUT.compactHeadlineFontSize : 24,
      timingConfig
    ),
    marginBottom: withTiming(isKeyboardVisible ? 16 : 32, timingConfig),
    marginTop: withTiming(isKeyboardVisible ? 16 : 32, timingConfig),
  }));

  const chipsAnimatedStyle = useAnimatedStyle(() => ({
    marginBottom: withTiming(isKeyboardVisible ? 0 : 32, timingConfig),
    maxHeight: withTiming(isKeyboardVisible ? 0 : 200, timingConfig),
    opacity: withTiming(isKeyboardVisible ? 0 : 1, timingConfig),
    overflow: 'hidden' as const,
  }));

  const secondaryLinksAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: withTiming(isKeyboardVisible ? 0 : 100, timingConfig),
    opacity: withTiming(isKeyboardVisible ? 0 : 1, timingConfig),
    overflow: 'hidden' as const,
  }));

  // Component state
  const [inputValue, setInputValue] = useState('');
  const [selectedChipIndex, setSelectedChipIndex] = useState<number | null>(
    null
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [successHabitName, setSuccessHabitName] = useState<string | null>(null);
  const [successEmoji, setSuccessEmoji] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle chip selection - populates input with full habit name
  // Tapping a selected chip deselects it and clears input
  const handleChipSelect = useCallback(
    (index: number, chip: SuggestionChip) => {
      if (selectedChipIndex === index) {
        // Deselect if tapping the same chip
        setSelectedChipIndex(null);
        setSelectedEmoji(null);
        setInputValue('');
      } else {
        setSelectedChipIndex(index);
        setSelectedEmoji(chip.emoji);
        setInputValue(chip.fullName);
      }
    },
    [selectedChipIndex]
  );

  // Handle text input changes - deselects chips when typing
  const handleInputChange = useCallback(
    (text: string) => {
      setInputValue(text);
      // Deselect chips when user types manually
      if (selectedChipIndex !== null) {
        setSelectedChipIndex(null);
        setSelectedEmoji(null);
      }
    },
    [selectedChipIndex]
  );

  // Handle CTA button press - creates the habit
  const handleCreateHabit = useCallback(async () => {
    if (!inputValue.trim() || isCreating) return;

    Keyboard.dismiss();
    setIsCreating(true);
    setErrorMessage(null);

    try {
      await onQuickCreateHabit(inputValue.trim());
      triggerSuccess();
      setSuccessHabitName(inputValue.trim());
      setSuccessEmoji(selectedEmoji); // Save emoji for success state
    } catch (error) {
      setIsCreating(false);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to create habit. Please try again.'
      );
    }
  }, [
    inputValue,
    isCreating,
    onQuickCreateHabit,
    triggerSuccess,
    selectedEmoji,
  ]);

  // Handle keyboard submit (Done button)
  const handleSubmitEditing = useCallback(() => {
    if (inputValue.trim() && !isCreating) {
      handleCreateHabit();
    }
  }, [inputValue, isCreating, handleCreateHabit]);

  // Handle clear input button
  const handleClearInput = useCallback(() => {
    setInputValue('');
    setSelectedChipIndex(null);
    setSelectedEmoji(null);
    inputRef.current?.focus();
  }, []);

  // Handle "Add another habit" from success state
  const handleAddAnother = useCallback(() => {
    setSuccessHabitName(null);
    setSuccessEmoji(null);
    setInputValue('');
    setSelectedChipIndex(null);
    setSelectedEmoji(null);
    setIsCreating(false);
    // Focus input for next habit entry
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Handle error dismiss
  const handleDismissError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  // Show success state if habit was created
  if (successHabitName) {
    // If we have a transition callback, auto-transition after celebration
    // Otherwise, show "Add another" button
    const shouldAutoTransition = !!onSuccessTransitionComplete;

    return (
      <SuccessState
        autoTransition={shouldAutoTransition}
        habitEmoji={successEmoji}
        habitName={successHabitName}
        onAddAnother={handleAddAnother}
        onTransitionComplete={onSuccessTransitionComplete}
      />
    );
  }

  // Show loading skeleton during initial load
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const isCtaDisabled = !inputValue.trim();

  return (
    <Animated.View
      style={[
        {
          alignItems: 'center',
          flex: 1,
          minHeight: '100%',
          width: '100%',
        },
        containerAnimatedStyle,
      ]}
    >
      {/* Hero Icon - animates to compact size when keyboard visible */}
      <Animated.View style={heroAnimatedStyle}>
        <AnimatedEntrance delay={ENTRANCE_DELAYS.heroIcon}>
          <HeroIcon animate={!isLoading} />
        </AnimatedEntrance>
      </Animated.View>

      {/* Question Headline - animates to smaller font when keyboard visible */}
      <AnimatedEntrance delay={ENTRANCE_DELAYS.headline}>
        <Animated.Text
          style={[
            {
              color: COLORS.stone800,
              fontWeight: '700',
              lineHeight: 32,
              textAlign: 'center',
            },
            headlineAnimatedStyle,
          ]}
        >
          {COPY.headline}
        </Animated.Text>
      </AnimatedEntrance>

      {/* Text Input - full width */}
      <View style={{ marginBottom: 24, width: '100%' }}>
        <AnimatedEntrance delay={ENTRANCE_DELAYS.input}>
          <HabitInput
            ref={inputRef}
            value={inputValue}
            onChangeText={handleInputChange}
            onClear={handleClearInput}
            onSubmitEditing={handleSubmitEditing}
          />
        </AnimatedEntrance>
      </View>

      {/* Suggestion Chips - fades out when keyboard visible */}
      {/* Note: Each chip has its own staggered entrance animation, no wrapper needed */}
      <Animated.View
        accessibilityElementsHidden={isKeyboardVisible}
        importantForAccessibility={
          isKeyboardVisible ? 'no-hide-descendants' : 'auto'
        }
        style={[{ width: '100%' }, chipsAnimatedStyle]}
      >
        <SuggestionChips
          selectedIndex={selectedChipIndex}
          onSelect={handleChipSelect}
        />
      </Animated.View>

      {/* Primary CTA Button - full width */}
      <View style={{ width: '100%' }}>
        <AnimatedEntrance delay={ENTRANCE_DELAYS.cta}>
          <CtaButton
            disabled={isCtaDisabled}
            isLoading={isCreating}
            onPress={handleCreateHabit}
          />
        </AnimatedEntrance>
      </View>

      {/* Error Message */}
      {errorMessage && (
        <ErrorMessage message={errorMessage} onDismiss={handleDismissError} />
      )}

      {/* Secondary Links - fades out when keyboard visible */}
      <Animated.View
        accessibilityElementsHidden={isKeyboardVisible}
        importantForAccessibility={
          isKeyboardVisible ? 'no-hide-descendants' : 'auto'
        }
        style={secondaryLinksAnimatedStyle}
      >
        <AnimatedEntrance delay={ENTRANCE_DELAYS.secondaryLinks}>
          <SecondaryLinks
            onBrowseTemplates={openTemplatesScreen}
            onCreateCustom={openCreateHabitScreen}
          />
        </AnimatedEntrance>
      </Animated.View>
    </Animated.View>
  );
}
