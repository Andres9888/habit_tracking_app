/**
 * Hooks for VoiceNotesSection component
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAudioRecording } from '../../../../hooks/useAudioRecording';
import { MAX_RECORDING_DURATION, FREE_TIER_MAX_NOTES } from './VoiceNotesSection.constants';

interface UseVoiceNotesSectionOptions {
  voiceNoteCount: number;
  isPremium: boolean;
  onSaveRecording: (audioUri: string, durationSeconds: number, isDay1: boolean) => Promise<void>;
  onPremiumRequired: () => void;
}

export function useVoiceNotesSection({
  voiceNoteCount,
  isPremium,
  onSaveRecording,
  onPremiumRequired,
}: UseVoiceNotesSectionOptions) {
  const [isDay1Recording, setIsDay1Recording] = useState(false);
  const canRecord = isPremium || voiceNoteCount < FREE_TIER_MAX_NOTES;

  const recording = useAudioRecording({
    maxDurationSeconds: MAX_RECORDING_DURATION,
    onError: (error) => { if (__DEV__) console.error('Recording error:', error); },
    onMaxDurationReached: () => recording.stopRecording(),
    onPermissionDenied: (canAskAgain) => {
      if (__DEV__) console.log('Microphone permission denied, canAskAgain:', canAskAgain);
    },
    onRecordingComplete: async (uri, durationSeconds) => {
      const shouldMarkAsDay1 = isDay1Recording || voiceNoteCount === 0;
      try {
        await onSaveRecording(uri, durationSeconds, shouldMarkAsDay1);
        recording.reset();
        setIsDay1Recording(false);
      } catch (error) {
        if (__DEV__) console.error('Failed to save voice note recording:', error);
        Alert.alert('Error', 'Failed to save recording. Please try again.');
      }
    },
    onWarningThresholdReached: (secondsRemaining) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // warning threshold reached
    },
    warningThresholdSeconds: 30,
  });

  const handleStartRecording = useCallback(() => {
    if (!canRecord) {
      onPremiumRequired();
      return;
    }
    recording.startRecording();
  }, [canRecord, onPremiumRequired, recording]);

  const handleStopRecording = useCallback(async () => {
    await recording.stopRecording();
  }, [recording]);

  const handleSectionPress = useCallback(() => {
    if (!recording.isRecording && !canRecord) {
      onPremiumRequired();
    }
  }, [recording.isRecording, canRecord, onPremiumRequired]);

  return {
    ...recording,
    canRecord,
    handleSectionPress,
    handleStartRecording,
    handleStopRecording,
  };
}
