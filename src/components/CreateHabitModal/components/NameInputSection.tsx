/**
 * NameInputSection - Shared habit-name heading + input for both Add and Edit.
 * "Balanced" direction: left-aligned heading, caps NAME label, stone field
 * that only goes green on focus — same label system as the sections below.
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import { SectionLabel } from '@/components/AdvancedOptions/panel/SectionLabel';
import { usePanelTokens } from '@/components/AdvancedOptions/panel/panelTokens';
import { typography } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';
import STRINGS from '@/constants/strings';
import { HabitNameInputField } from './HabitNameInputField';
import { useFocusedGreenInputStyle } from './useFocusedGreenInputStyle';

interface NameInputSectionProps {
  habitName: string;
  onHabitNameChange: (text: string) => void;
  onHabitNameBlur?: () => void;
  title?: string;
  placeholder?: string;
  showNameError?: boolean;
  autoFocus?: boolean;
}

export function NameInputSection({
  habitName,
  onHabitNameChange,
  onHabitNameBlur,
  title = STRINGS.CREATE_HABIT.nameTitle,
  placeholder = STRINGS.CREATE_HABIT.namePlaceholder,
  showNameError = false,
  autoFocus = false,
}: NameInputSectionProps) {
  const { colors } = useThemeColors();
  const t = usePanelTokens();
  const [isFocused, setIsFocused] = useState(false);
  const focusedInputStyle = useFocusedGreenInputStyle(
    isFocused,
    showNameError,
    t.panelBorder,
    1.5
  );
  // "e.g." prefix + the panel's hint colour keep the suggestion from reading
  // as a typed value.
  const hintText = placeholder ? `e.g. ${placeholder}` : '';

  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 24, marginBottom: 24 }}>
      <Text
        accessibilityRole='header'
        style={{
          ...typography.heading2,
          color: colors.text.primary,
          marginBottom: 20,
        }}
      >
        {title}
      </Text>
      <SectionLabel label='NAME' />

      <HabitNameInputField
        autoFocus={autoFocus}
        backgroundColor={t.chipRestBg}
        borderStyle={focusedInputStyle}
        habitName={habitName}
        hintColor={t.chevron}
        placeholder={hintText}
        textColor={t.textPrimary}
        onBlur={() => {
          setIsFocused(false);
          onHabitNameBlur?.();
        }}
        onChangeText={onHabitNameChange}
        onFocus={() => setIsFocused(true)}
      />

      {showNameError ? (
        <Text
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          className='mt-3 text-sm font-medium'
          style={{ color: colors.status.error }}
        >
          Give your habit a name
        </Text>
      ) : null}
    </View>
  );
}
