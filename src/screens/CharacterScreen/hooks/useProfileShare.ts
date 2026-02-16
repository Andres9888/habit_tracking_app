/**
 * useProfileShare Hook
 * Handles sharing of profile/character stats
 */

import { useState, useRef, useCallback } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import type { CharacterData } from '../types';

export function useProfileShare(characterData: CharacterData) {
  const viewShotRef = useRef<ViewShot>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!viewShotRef.current || !viewShotRef.current.capture) return;

    try {
      setIsSharing(true);
      const uri = await viewShotRef.current.capture();
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          dialogTitle: `Share your Level ${characterData.level} progress!`,
          mimeType: 'image/png',
          UTI: 'public.png',
        });
      } else {
        if (__DEV__) console.warn('Sharing is not available on this device');
        alert('Sharing is not available. Please save the image manually.');
      }
    } catch (error) {
      if (__DEV__) console.error('Error sharing profile:', error);
      alert('Failed to share profile. Please try again.');
    } finally {
      setIsSharing(false);
    }
  }, [characterData.level]);

  return {
    handleShare,
    isSharing,
    viewShotRef,
  };
}
