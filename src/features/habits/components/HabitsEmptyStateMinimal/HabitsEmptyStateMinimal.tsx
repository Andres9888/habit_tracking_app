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
import { HabitInput } from './HabitInput';
import { HeroIcon } from './HeroIcon';
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
  const [selectedChipIndex, setSelectedChipIndex] = useState<number | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [successHabitName, setSuccessHabitName] = useState<string | null>(null);
  const [successEmoji, setSuccessEmoji] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle chip selection - populates input with full habit name
  // Tapping a selected chip deselects it and clears input
  const handleChipSelect = useCallback((index: number, chip: SuggestionChip) => {
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
  }, [selectedChipIndex]);

  // Handle text input changes - deselects chips when typing
  const handleInputChange = useCallback((text: string) => {
    setInputValue(text);
    // Deselect chips when user types manually
    if (selectedChipIndex !== null) {
      setSelectedChipIndex(null);
      setSelectedEmoji(null);
    }
  }, [selectedChipIndex]);

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
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create habit. Please try again.');
    }
  }, [inputValue, isCreating, onQuickCreateHabit, triggerSuccess, selectedEmoji]);

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

  // Show success state if habit was created
  if (successHabitName) {
    // If we have a transition callback, auto-transition after celebration
    // Otherwise, show "Add another" button
    const shouldAutoTransition = !!onSuccessTransitionComplete;

    return (
      <SuccessState
        habitName={successHabitName}
        habitEmoji={successEmoji}
        onAddAnother={handleAddAnother}
        onTransitionComplete={onSuccessTransitionComplete}
        autoTransition={shouldAutoTransition}
      />
    );
  }

  const isCtaDisabled = !inputValue.trim() || isLoading;

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
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
            marginTop: 32,
            marginBottom: 32,
            fontSize: 24,
            fontWeight: '700',
            color: COLORS.stone800,
            textAlign: 'center',
            lineHeight: 32,
          }}
        >
          {COPY.headline}
        </Text>
      </AnimatedEntrance>

      {/* Text Input - full width */}
      <View style={{ width: '100%', marginBottom: 24 }}>
        <AnimatedEntrance delay={ENTRANCE_DELAYS.input}>
          <HabitInput
            ref={inputRef}
            value={inputValue}
            onChangeText={handleInputChange}
            onSubmitEditing={handleSubmitEditing}
            onClear={handleClearInput}
          />
        </AnimatedEntrance>
      </View>

      {/* Suggestion Chips - full width for proper wrapping */}
      <View style={{ width: '100%', marginBottom: 32 }}>
        <AnimatedEntrance delay={ENTRANCE_DELAYS.chips}>
          <SuggestionChips
            selectedIndex={selectedChipIndex}
            onSelect={handleChipSelect}
          />
        </AnimatedEntrance>
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
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          style={{
            marginTop: 12,
            fontSize: 15,
            color: '#DC2626',
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </Text>
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
