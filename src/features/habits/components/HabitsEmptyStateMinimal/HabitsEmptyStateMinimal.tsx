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
}: HabitsEmptyStateMinimalProps) {
  const inputRef = useRef<TextInput>(null);
  const { triggerSuccess } = useHapticFeedback();

  // Component state
  const [inputValue, setInputValue] = useState('');
  const [selectedChipIndex, setSelectedChipIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [successHabitName, setSuccessHabitName] = useState<string | null>(null);

  // Handle chip selection - populates input with full habit name
  const handleChipSelect = useCallback((index: number, chip: SuggestionChip) => {
    setSelectedChipIndex(index);
    setInputValue(chip.fullName);
  }, []);

  // Handle text input changes - deselects chips when typing
  const handleInputChange = useCallback((text: string) => {
    setInputValue(text);
    // Deselect chips when user types manually
    if (selectedChipIndex !== null) {
      setSelectedChipIndex(null);
    }
  }, [selectedChipIndex]);

  // Handle CTA button press - creates the habit
  const handleCreateHabit = useCallback(async () => {
    if (!inputValue.trim() || isCreating) return;

    Keyboard.dismiss();
    setIsCreating(true);

    try {
      await onQuickCreateHabit(inputValue.trim());
      triggerSuccess();
      setSuccessHabitName(inputValue.trim());
    } catch {
      // Error handling done by parent
      setIsCreating(false);
    }
  }, [inputValue, isCreating, onQuickCreateHabit, triggerSuccess]);

  // Handle "Add another habit" from success state
  const handleAddAnother = useCallback(() => {
    setSuccessHabitName(null);
    setInputValue('');
    setSelectedChipIndex(null);
    setIsCreating(false);
    // Focus input for next habit entry
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Show success state if habit was created
  if (successHabitName) {
    return (
      <SuccessState
        habitName={successHabitName}
        onAddAnother={handleAddAnother}
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
      <HeroIcon animate={!isLoading} />

      {/* Question Headline */}
      <Text
        style={{
          marginTop: 24,
          marginBottom: 24,
          fontSize: 24,
          fontWeight: '700',
          color: COLORS.stone800,
          textAlign: 'center',
          lineHeight: 32,
        }}
      >
        {COPY.headline}
      </Text>

      {/* Text Input */}
      <View style={{ width: '100%', marginBottom: 16 }}>
        <HabitInput
          ref={inputRef}
          value={inputValue}
          onChangeText={handleInputChange}
        />
      </View>

      {/* Suggestion Chips */}
      <View style={{ marginBottom: 24 }}>
        <SuggestionChips
          selectedIndex={selectedChipIndex}
          onSelect={handleChipSelect}
        />
      </View>

      {/* Primary CTA Button */}
      <View style={{ width: '100%' }}>
        <CtaButton
          disabled={isCtaDisabled}
          isLoading={isCreating}
          onPress={handleCreateHabit}
        />
      </View>

      {/* Secondary Links */}
      <SecondaryLinks
        onBrowseTemplates={openTemplatesScreen}
        onCreateCustom={openCreateHabitScreen}
      />
    </View>
  );
}
