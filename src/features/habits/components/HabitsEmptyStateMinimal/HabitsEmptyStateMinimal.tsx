/**
 * HabitsEmptyStateMinimal - Main Component
 *
 * Ultra-minimal empty state design focused on a single question flow.
 */

import { useRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboardVisible } from '../../../../hooks/useKeyboardVisible';
import { ActionSection } from './ActionSection';
import { AnimatedEntrance } from './AnimatedEntrance';
import { ENTRANCE_DELAYS } from './animations';
import { ChipsSection } from './ChipsSection';
import { COLORS, COPY } from './constants';
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

      {/* Social proof */}
      {!isKeyboardVisible && (
        <AnimatedEntrance delay={ENTRANCE_DELAYS.chips + 60}>
          <Text
            style={{
              color: COLORS.stone400,
              fontSize: 12,
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            {COPY.socialProof}
          </Text>
        </AnimatedEntrance>
      )}

      {/* Progress hint when typing */}
      {flow.inputValue.trim().length > 0 && (
        <View style={{ marginTop: 6 }}>
          <Text
            style={{
              color: COLORS.emerald500,
              fontSize: 12,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {COPY.progressHint}
          </Text>
        </View>
      )}

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
  );
}
