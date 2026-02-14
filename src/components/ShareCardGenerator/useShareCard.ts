/**
 * useShareCard Hook
 * Manages state and sharing logic for ShareCardGenerator
 */

import { useMemo, useRef, useState } from 'react';
import { Alert, Share } from 'react-native';
import ViewShot from 'react-native-view-shot';
import type { SharePlatform, ShareCardData } from './ShareCardGenerator.types';
import {
  SHARE_FORMATS,
  GRADIENT_PRESETS,
  DEFAULT_PLATFORM,
  APP_STORE_LINK,
  STREAK_MILESTONE_CONFIG,
  MILESTONE_CONFIG,
} from './ShareCardGenerator.constants';

const FALLBACK_MESSAGE = 'Show up today, and future-you will thank you.';

export function useShareCard(data: ShareCardData) {
  const viewShotRef = useRef<ViewShot>(null);

  const [selectedGradient, setSelectedGradient] = useState(0);
  const [showUserName, setShowUserName] = useState(true);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SharePlatform>(DEFAULT_PLATFORM);
  const [isGenerating, setIsGenerating] = useState(false);

  const streakCount = data.streakCount ?? 0;
  const milestoneDays = (data.milestoneDays ?? 7) as 7 | 30 | 100;

  const milestoneConfig = useMemo(() => {
    if (data.milestoneLevel) {
      return MILESTONE_CONFIG[data.milestoneLevel];
    }

    return STREAK_MILESTONE_CONFIG[milestoneDays];
  }, [data.milestoneLevel, milestoneDays]);

  const motivationalMessage =
    data.motivationalMessage ??
    ('message' in milestoneConfig ? milestoneConfig.message : FALLBACK_MESSAGE);

  const format = SHARE_FORMATS[selectedPlatform];
  const defaultGradientIndex = milestoneDays === 100 ? 2 : milestoneDays === 30 ? 1 : 0;
  const gradient = GRADIENT_PRESETS[selectedGradient] ?? GRADIENT_PRESETS[defaultGradientIndex];

  const getPlatformCaption = (platform: SharePlatform): string => {
    const baseMessage = `I just hit a ${streakCount}-day ${data.habitName} streak on Chain Day 🔗`;

    switch (platform) {
      case 'instagram-story':
        return `${baseMessage}\n\n${motivationalMessage}\n\n#ChainDay #HabitTracking #Consistency\n${APP_STORE_LINK}`;
      case 'twitter':
        return `${baseMessage}. ${motivationalMessage} ${APP_STORE_LINK} #ChainDay #HabitStreak`;
      case 'whatsapp':
        return `${baseMessage}\n${motivationalMessage}\n\nBuild your streak with me: ${APP_STORE_LINK}`;
      default:
        return `${baseMessage}\n\n${APP_STORE_LINK}`;
    }
  };

  const handleShare = async () => {
    if (!viewShotRef.current || !viewShotRef.current.capture) return;

    try {
      setIsGenerating(true);
      const uri = await viewShotRef.current.capture();
      const message = getPlatformCaption(selectedPlatform);

      await Share.share({
        message,
        title: `Share your ${milestoneConfig.label} achievement`,
        url: uri,
      });
    } catch (error) {
      if (__DEV__) console.error('Error sharing card:', error);
      Alert.alert('Share failed', 'Could not generate share card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    format,
    gradient,
    handleShare,
    isGenerating,
    milestoneConfig,
    motivationalMessage,
    selectedGradient,
    selectedPlatform,
    setSelectedGradient,
    setSelectedPlatform,
    setShowUserName,
    showUserName,
    streakCount,
    viewShotRef,
  };
}
