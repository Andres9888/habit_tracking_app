/**
 * useStatCard — state management and sharing logic for StatCardGenerator
 */

import { useState, useRef } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import {
  DEFAULT_CARD_TYPE,
  DEFAULT_VARIANT,
  CARD_TYPE_CONFIG,
  APP_STORE_LINK,
} from './StatCardGenerator.constants';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import type {
  StatCardType,
  StatCardVariant,
  StreakCardData,
  MonthlyRecapCardData,
  YearInReviewCardData,
} from './StatCardGenerator.types';

interface UseStatCardOptions {
  streakData: StreakCardData;
  monthlyData: MonthlyRecapCardData;
  yearData: YearInReviewCardData;
}

export function useStatCard({
  streakData,
  monthlyData,
  yearData,
}: UseStatCardOptions) {
  const viewShotRef = useRef<ViewShot>(null);

  const [selectedType, setSelectedType] =
    useState<StatCardType>(DEFAULT_CARD_TYPE);
  const [selectedVariant, setSelectedVariant] =
    useState<StatCardVariant>(DEFAULT_VARIANT);
  const [isGenerating, setIsGenerating] = useState(false);

  // ---------------------------------------------------------------------------
  // Caption generator: platform-aware text copy for the share sheet
  // ---------------------------------------------------------------------------

  const getShareCaption = (): string => {
    const config = CARD_TYPE_CONFIG[selectedType];

    switch (selectedType) {
      case 'streak-30day': {
        return (
          `🔥 ${streakData.bestStreak}-day streak with ${streakData.bestHabitName}!\n\n` +
          `I have ${streakData.activeStreakCount} habits actively on a roll. ` +
          `Science says 66 days builds lasting habits — I'm ${streakData.formationProgress}% there.\n\n` +
          `#HabitTracking #Streak #Productivity #AtomicHabits\n\n${APP_STORE_LINK}`
        );
      }
      case 'monthly-recap': {
        return (
          `📊 ${monthlyData.completionRate}% habit completion rate in ${monthlyData.monthLabel}!\n\n` +
          `${monthlyData.totalCompletions} check-ins, ${monthlyData.perfectDays} perfect days. ` +
          `My best day: ${monthlyData.bestDayOfWeek}.\n\n` +
          `#HabitTracking #MonthlyRecap #Productivity\n\n${APP_STORE_LINK}`
        );
      }
      case 'year-in-review': {
        return (
          `🌟 My ${yearData.year} habit journey:\n` +
          `• ${yearData.daysTracked} days tracked\n` +
          `• ${yearData.totalCompletions.toLocaleString()} habit completions\n` +
          `• ${yearData.habitsFormed} habits formed\n` +
          `• ${yearData.longestStreak}-day longest streak\n\n` +
          `#YearInReview #HabitTracking #Growth\n\n${APP_STORE_LINK}`
        );
      }
      default: {
        return `${config.emoji} Check out my habit stats! ${APP_STORE_LINK}`;
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Share handler
  // ---------------------------------------------------------------------------

  const handleShare = async () => {
    if (!viewShotRef.current?.capture) return;

    try {
      setIsGenerating(true);
      const uri = await viewShotRef.current.capture();
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          dialogTitle: `Share your ${CARD_TYPE_CONFIG[selectedType].label}!`,
          mimeType: 'image/png',
          UTI: 'public.png',
        });
      } else {
        if (__DEV__)
          console.warn('Sharing is not available on this device');
        alert('Sharing is not available. Please save the image manually.');
      }
    } catch (error) {
      if (__DEV__) console.error('Error sharing stat card:', error);
      alert(ERROR_MESSAGES.DATA_OPS.SHARE_CARD_FAILED);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    getShareCaption,
    handleShare,
    isGenerating,
    selectedType,
    selectedVariant,
    setSelectedType,
    setSelectedVariant,
    viewShotRef,
  };
}
