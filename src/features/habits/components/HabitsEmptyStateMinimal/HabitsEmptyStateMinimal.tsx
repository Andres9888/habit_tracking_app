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

import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { AnimatedEntrance } from './AnimatedEntrance';
import { ENTRANCE_DELAYS } from './animations';
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
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      {/* Hero Icon */}
      <AnimatedEntrance delay={ENTRANCE_DELAYS.heroIcon}>
        <HeroIcon animate={!isLoading} />
      </AnimatedEntrance>

      {/* Question Headline */}
      <AnimatedEntrance delay={ENTRANCE_DELAYS.headline}>
        <Text
          style={{
            color: COLORS.stone800,
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 32,
            marginBottom: 32,
            marginTop: 32,
            textAlign: 'center',
          }}
        >
          {COPY.headline}
        </Text>
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

      {/* Suggestion Chips - full width for proper wrapping */}
      {/* Note: Each chip has its own staggered entrance animation, no wrapper needed */}
      <View style={{ marginBottom: 32, width: '100%' }}>
        <SuggestionChips
          selectedIndex={selectedChipIndex}
          onSelect={handleChipSelect}
        />
      </View>

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

      {/* Secondary Links */}
      <AnimatedEntrance delay={ENTRANCE_DELAYS.secondaryLinks}>
        <SecondaryLinks
          onBrowseTemplates={openTemplatesScreen}
          onCreateCustom={openCreateHabitScreen}
        />
      </AnimatedEntrance>
    </View>
  );
}
