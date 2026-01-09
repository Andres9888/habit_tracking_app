/**
 * GenerateAffirmationsButton Component
 * AI-powered affirmation generation button for premium users
 *
 * Part of the Motivation System Workshop tab
 * Feature: AI-generated affirmations based on habit
 *
 * Scientific Basis:
 * - Personalized affirmations are more effective (Sherman & Cohen, 2006)
 * - Context-specific self-talk improves outcomes (Hatzigeorgiadis et al., 2011)
 * - Identity-based affirmations align with Atomic Habits methodology
 */

import React from 'react';
import { DEFAULT_MAX_COUNT } from './constants';
import { useGenerateButton } from './useGenerateButton';
import { CompactButton } from './CompactButton';
import { FullButton } from './FullButton';
import type { GenerateAffirmationsButtonProps } from './types';

export function GenerateAffirmationsButton({
  isPremium,
  isGenerating,
  onGenerate,
  onPremiumRequired,
  reduceMotion = false,
  currentCount = 0,
  maxCount = DEFAULT_MAX_COUNT,
  variant = 'full',
  hasHabitContext = false,
}: GenerateAffirmationsButtonProps) {
  const remainingSlots = maxCount - currentCount;
  const canGenerate = remainingSlots > 0 && !isGenerating;

  const {
    showSuccess,
    animatedStyle,
    handlePress,
    handlePressIn,
    handlePressOut,
  } = useGenerateButton({
    canGenerate,
    isGenerating,
    isPremium,
    maxCount,
    onGenerate,
    onPremiumRequired,
    remainingSlots,
  });

  if (variant === 'compact') {
    return (
      <CompactButton
        animatedStyle={animatedStyle}
        hasHabitContext={hasHabitContext}
        isGenerating={isGenerating}
        isPremium={isPremium}
        reduceMotion={reduceMotion}
        showSuccess={showSuccess}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      />
    );
  }

  return (
    <FullButton
      animatedStyle={animatedStyle}
      canGenerate={canGenerate}
      hasHabitContext={hasHabitContext}
      isGenerating={isGenerating}
      isPremium={isPremium}
      reduceMotion={reduceMotion}
      remainingSlots={remainingSlots}
      showSuccess={showSuccess}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    />
  );
}

export default GenerateAffirmationsButton;
