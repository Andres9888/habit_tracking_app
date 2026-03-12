/**
 * useShareCard Hook
 * Manages state and sharing logic for ShareCardGenerator
 */

import { useState, useRef } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import type {
  SharePlatform,
  ShareCardData,
} from './ShareCardGenerator.types';
import {
  SHARE_FORMATS,
  MILESTONE_CONFIG,
  GRADIENT_PRESETS,
  DEFAULT_PLATFORM,
  APP_STORE_LINK,
} from './ShareCardGenerator.constants';
import { ERROR_MESSAGES } from '../../constants/errorMessages';

export function useShareCard(data: ShareCardData) {
  const viewShotRef = useRef<ViewShot>(null);

  const [selectedGradient, setSelectedGradient] = useState(0);
  const [personalMessage, setPersonalMessage] = useState('');
  const [showUserName, setShowUserName] = useState(true);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SharePlatform>(DEFAULT_PLATFORM);
  const [isGenerating, setIsGenerating] = useState(false);

  const milestoneConfig = MILESTONE_CONFIG[data.milestoneLevel];
  const format = SHARE_FORMATS[selectedPlatform];
  const gradient = GRADIENT_PRESETS[selectedGradient];

  const getPlatformCaption = (platform: SharePlatform): string => {
    const baseMessage = `Just reached ${milestoneConfig.label} level (${data.strengthPercentage}%) with my ${data.habitName} habit!`;

    switch (platform) {
      case 'instagram-story':
      case 'instagram-feed': {
        return `${baseMessage}\n\nBuilding better habits with science-backed tracking\n\n#HabitTracking #AtomicHabits #BehaviorChange #SelfImprovement #Productivity\n\n${APP_STORE_LINK}`;
      }
      case 'twitter': {
        return `${baseMessage}\n\nTracking habits with science ${APP_STORE_LINK}\n\n#HabitTracking #Productivity`;
      }
      case 'facebook': {
        return `${baseMessage}\n\nI've been using this amazing habit tracking app that uses real behavioral science to help build lasting habits. Check it out!\n\n${APP_STORE_LINK}`;
      }
      default: {
        return baseMessage;
      }
    }
  };

  const handleShare = async () => {
    if (!viewShotRef.current || !viewShotRef.current.capture) return;

    try {
      setIsGenerating(true);
      const uri = await viewShotRef.current.capture();
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          dialogTitle: `Share your ${milestoneConfig.label} achievement!`,
          mimeType: 'image/png',
          UTI: 'public.png',
        });
      } else {
        if (__DEV__) console.warn('Sharing is not available on this device');
        alert('Sharing is not available. Please save the image manually.');
      }
    } catch (error) {
      if (__DEV__) console.error('Error sharing card:', error);
      alert(ERROR_MESSAGES.DATA_OPS.SHARE_CARD_FAILED);
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
    personalMessage,
    selectedGradient,
    selectedPlatform,
    setPersonalMessage,
    setSelectedGradient,
    setSelectedPlatform,
    setShowUserName,
    showUserName,
    viewShotRef,
  };
}
