/**
 * HabitsEmptyStateMinimal - Main Component
 *
 * Ultra-minimal empty state design focused on a single question flow.
 */

import { useEffect, useRef } from 'react';
import { Platform, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboardVisible } from '../../../../hooks/useKeyboardVisible';
import { ActionSection } from './ActionSection';
import { ChipsSection } from './ChipsSection';
import { HeroSection } from './HeroSection';
import { InputSection } from './InputSection';
import { LoadingSkeleton } from './LoadingSkeleton';
import { SuccessState } from './SuccessState';
import type { HabitsEmptyStateMinimalProps } from './types';
import { useHabitCreationFlow } from './useHabitCreationFlow';
import { useKeyboardLayoutAnimations } from './useKeyboardLayoutAnimations';

export function HabitsEmptyStateMinimal({
  isLoading = false,
  onQuickCreateHabit,
  openTemplatesScreen,
  openCreateHabitScreen,
  onSuccessTransitionComplete,
}: HabitsEmptyStateMinimalProps) {
  const inputRef = useRef<TextInput>(null);
  const { isKeyboardVisible } = useKeyboardVisible();
  const insets = useSafeAreaInsets();

  const animations = useKeyboardLayoutAnimations({
    bottomInset: insets.bottom,
    isKeyboardVisible,
  });

  const flow = useHabitCreationFlow({ inputRef, onQuickCreateHabit });

  // Auto-focus input after entrance animations complete (iOS only — Android keyboards can be jarring)
  useEffect(() => {
    if (!isLoading && Platform.OS === 'ios') {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 800); // After entrance animations settle
      return () => clearTimeout(timer);
    }
  }, [isLoading, inputRef]);

  if (flow.successHabitName) {
    return (
      <SuccessState
        autoTransition={!!onSuccessTransitionComplete}
        habitEmoji={flow.successEmoji ?? undefined}
        habitName={flow.successHabitName}
        onAddAnother={flow.handleAddAnother}
        onTransitionComplete={onSuccessTransitionComplete}
      />
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <LinearGradient
      colors={['#FAFAF9', '#F0FDF4', '#ECFDF5', '#F0FDF4', '#FAFAF9']}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={{ flex: 1, minHeight: '100%', width: '100%' }}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            minHeight: '100%',
            paddingHorizontal: 24,
            width: '100%',
          },
          animations.containerAnimatedStyle,
        ]}
      >
      <HeroSection
        headlineAnimatedStyle={animations.headlineAnimatedStyle}
        heroAnimatedStyle={animations.heroAnimatedStyle}
        isLoading={isLoading}
      />

      <InputSection
        ref={inputRef}
        inputValue={flow.inputValue}
        onChangeText={flow.handleInputChange}
        onClear={flow.handleClearInput}
        onSubmitEditing={flow.handleSubmitEditing}
      />

      <ChipsSection
        chipsAnimatedStyle={animations.chipsAnimatedStyle}
        isKeyboardVisible={isKeyboardVisible}
        selectedIndex={flow.selectedChipIndex}
        onSelect={flow.handleChipSelect}
      />

      <ActionSection
        errorMessage={flow.errorMessage}
        inputValue={flow.inputValue}
        isCreating={flow.isCreating}
        isKeyboardVisible={isKeyboardVisible}
        secondaryLinksAnimatedStyle={animations.secondaryLinksAnimatedStyle}
        onBrowseTemplates={openTemplatesScreen}
        onCreateCustom={openCreateHabitScreen}
        onCreateHabit={flow.handleCreateHabit}
        onDismissError={flow.handleDismissError}
      />
      </Animated.View>
    </LinearGradient>
  );
}
