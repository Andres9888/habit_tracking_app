/**
 * HabitsEmptyStateMinimal - Main Component
 *
 * Ultra-minimal empty state design focused on a single question flow.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboardVisible } from '../../../../hooks/useKeyboardVisible';
import {
  trackEmptyStateViewed,
  trackQuickStartTapped,
  trackQuickStartCompleted,
  trackFirstHabitCreated,
} from '../../../../lib/analytics/funnelEvents';
import { ActionSection } from './ActionSection';
import { ChipsSection } from './ChipsSection';
import { QUICK_START_HABITS } from './constants';
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
  onQuickStart,
}: HabitsEmptyStateMinimalProps) {
  const inputRef = useRef<TextInput>(null);
  const { isKeyboardVisible } = useKeyboardVisible();
  const insets = useSafeAreaInsets();

  const animations = useKeyboardLayoutAnimations({
    bottomInset: insets.bottom,
    isKeyboardVisible,
  });

  const flow = useHabitCreationFlow({ inputRef, onQuickCreateHabit });
  const [isQuickStarting, setIsQuickStarting] = useState(false);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!isLoading && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackEmptyStateViewed();
    }
  }, [isLoading]);

  const handleQuickStart = useCallback(async () => {
    if (!onQuickStart || isQuickStarting) return;
    trackQuickStartTapped();
    setIsQuickStarting(true);
    try {
      await onQuickStart(
        QUICK_START_HABITS.map((h) => ({ name: h.name, emoji: h.emoji })),
      );
      trackQuickStartCompleted(QUICK_START_HABITS.length);
      trackFirstHabitCreated('quick_start');
    } catch {
      setIsQuickStarting(false);
    }
  }, [onQuickStart, isQuickStarting]);

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

      <ActionSection
        errorMessage={flow.errorMessage}
        inputValue={flow.inputValue}
        isCreating={flow.isCreating}
        isQuickStarting={isQuickStarting}
        isKeyboardVisible={isKeyboardVisible}
        secondaryLinksAnimatedStyle={animations.secondaryLinksAnimatedStyle}
        onBrowseTemplates={openTemplatesScreen}
        onCreateCustom={openCreateHabitScreen}
        onCreateHabit={flow.handleCreateHabit}
        onDismissError={flow.handleDismissError}
        onQuickStart={onQuickStart ? handleQuickStart : undefined}
      />
    </Animated.View>
  );
}
