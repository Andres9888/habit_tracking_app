/**
 * useInviteShare Hook
 * Handles sharing the app invitation
 */

import { useState, useCallback } from 'react';
import { Share, Platform } from 'react-native';

const APP_STORE_LINK = 'https://apps.apple.com/app/chain-day';
const PLAY_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.chainday';

export function useInviteShare(userName?: string) {
  const [isSharing, setIsSharing] = useState(false);

  const getShareMessage = useCallback(() => {
    const storeLink = Platform.OS === 'ios' ? APP_STORE_LINK : PLAY_STORE_LINK;
    
    if (userName) {
      return `Hey! ${userName} has been using Chain Day to build better habits and thought you might like it too.\n\nIt's a science-backed habit tracker that actually works. Check it out:\n${storeLink}`;
    }

    return `I've been using Chain Day to build better habits and it's amazing! 🎯\n\nScience-backed tracking that helps you stay consistent. Worth checking out:\n${storeLink}`;
  }, [userName]);

  const handleShare = useCallback(async () => {
    try {
      setIsSharing(true);
      const message = getShareMessage();

      await Share.share({
        message,
        title: 'Try Chain Day - Science-Backed Habit Tracking',
        url: Platform.OS === 'ios' ? APP_STORE_LINK : PLAY_STORE_LINK,
      });
    } catch (error) {
      if (__DEV__) {
        console.error('Error sharing invite:', error);
      }
      // Don't show error if user cancelled
      if ((error as Error).message !== 'User did not share') {
        alert('Failed to share invitation. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  }, [getShareMessage]);

  return {
    handleShare,
    isSharing,
  };
}
