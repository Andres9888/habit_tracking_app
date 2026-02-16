/**
 * @file CreateHabitFormCentered.tsx
 * @description Centered form layout for habit creation/editing.
 *
 * ## Architecture
 * Purely presentational — all state is received via props. The form follows
 * an "identity before behavior" pattern from habit formation psychology:
 * the name input is prominently centered at the top, with optional
 * customization (emoji, color, reminder) below.
 *
 * ## Layout
 * ```
 * ┌──────────────────────────────────┐
 * │   "Name your new habit"          │  ← Title
 * │   [ habit name input       ]     │  ← Primary input (centered, large)
 * │   error / char counter / hint    │  ← Contextual helper text
 * │                                  │
 * │   ─── CUSTOMIZE ───              │  ← Section divider
 * │   🎯  Emoji picker              │
 * │   🎨  Color picker              │
 * │   🔔  Reminder toggle + time    │
 * └──────────────────────────────────┘
 * ```
 *
 * ## Refactoring Opportunities
 * - **REFACTOR**: The name input section (title + input + helper text) could be
 *   extracted into a `HeroNameInput` component for reuse and testing.
 */

import { memo } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { EnhancedReminderSelector } from './EnhancedReminderSelector';
import type { CreateHabitFormCenteredProps } from './CreateHabitFormCentered.types';

// ── Component ────────────────────────────────────────────────────────

/**
 * Centered habit creation form with optional customization fields.
 *
 * @param habitName          - Current habit name value.
 * @param onHabitNameChange  - Callback when the name input text changes.
 * @param selectedEmoji      - Currently selected emoji for the habit icon.
 * @param onEmojiSelect      - Callback when a new emoji is picked.
 * @param colors             - Available color palette for the color picker.
 * @param selectedColor      - Currently selected habit color.
 * @param onColorSelect      - Callback when a new color is picked.
 * @param reminderEnabled    - Whether the daily reminder toggle is on.
 * @param reminderTime       - Selected reminder time (e.g., "09:00").
 * @param onReminderToggle   - Callback to toggle the reminder on/off.
 * @param onReminderTimeChange - Callback when the reminder time changes.
 * @param onSubmit           - Called when the user submits via keyboard "done" key.
 * @param autoFocus          - Whether to auto-focus the name input on mount.
 * @param showNameError      - When true, shows the validation error for the name field.
 */
const CreateHabitFormCenteredComponent = ({
  habitName,
  onHabitNameChange,
  selectedEmoji,
  onEmojiSelect,
  colors,
  selectedColor,
  onColorSelect,
  reminderEnabled,
  reminderTime,
  onReminderToggle,
  onReminderTimeChange,
  onSubmit,
  autoFocus = false,
  showNameError = false,
}: CreateHabitFormCenteredProps) => {
  const { colors: themeColors, isDark } = useThemeColors();

  // ── Render ─────────────────────────────────────────────────────

  return (
    <View className='flex-1 px-6'>
      {/* ── Name Input Section ─────────────────────────────────── */}
      <View
        className='items-center'
        style={{ marginBottom: 40, marginTop: 28 }}
      >
        <Text
          className='mb-6 text-center text-[28px] font-bold leading-tight'
          style={{ color: themeColors.text.primary }}
        >
          Name your new habit
        </Text>

        <TextInput
          accessibilityLabel='Habit name'
          autoFocus={autoFocus}
          className='w-full rounded-2xl border-2 px-5 py-4 text-center text-[22px] font-medium'
          maxLength={50}
          placeholder='e.g., Read 20 minutes daily'
          placeholderTextColor={isDark ? themeColors.text.tertiary : '#A8A29E'}
          returnKeyType='done'
          style={{
            lineHeight: 28,
            color: themeColors.text.primary,
            backgroundColor: isDark ? themeColors.card : '#FFFFFF',
            borderColor: showNameError
              ? '#f87171'
              : isDark
                ? themeColors.border
                : themeColors.border,
          }}
          value={habitName}
          onChangeText={onHabitNameChange}
          onSubmitEditing={Keyboard.dismiss}
        />

        {/* Contextual helper text — shows error, char count, or guidance */}
        {showNameError ? (
          <Text
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            className='mt-3 text-sm font-medium'
            style={{ color: '#ef4444' }}
          >
            Give your habit a name (at least 2 characters)
          </Text>
        ) : habitName.length > 0 ? (
          <Text
            className='mt-3 text-xs'
            style={{ color: themeColors.text.tertiary }}
          >
            {habitName.length}/50 characters
          </Text>
        ) : (
          <Text
            className='mt-3 text-xs'
            style={{ color: themeColors.text.tertiary }}
          >
            Be specific — include when, how long, or where
          </Text>
        )}
      </View>

      {/* ── Customization Section ──────────────────────────────── */}
      <View className='flex-1'>
        {/* Section divider label */}
        <Text
          className='mb-8 text-center text-xs font-semibold'
          style={{ letterSpacing: 1, color: themeColors.text.tertiary }}
        >
          CUSTOMIZE
        </Text>

        {/* Emoji picker — suggests relevant emojis based on habit name */}
        <EmojiPicker
          hideLabel
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />

        {/* Color picker — preset palette only (no custom hex input) */}
        <ColorPickerSection
          hideLabel
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={onColorSelect}
        />

        {/* Reminder toggle + time selector (presets + custom time picker) */}
        <EnhancedReminderSelector
          enabled={reminderEnabled}
          reminderTime={reminderTime}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </View>
    </View>
  );
};

/**
 * Memoized export — prevents re-renders when parent state changes
 * but none of this component's props have changed.
 */
export const CreateHabitFormCentered = memo(CreateHabitFormCenteredComponent);
