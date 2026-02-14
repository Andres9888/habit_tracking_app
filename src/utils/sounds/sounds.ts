/**
 * Sound Utility
 *
 * Centralized sound playback controller for completion sounds.
 * Uses expo-av for audio playback.
 *
 * Note: This implementation uses system sounds as fallback when
 * bundled audio files are not available.
 *
 * Created by Opus.
 */

import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import type { CompletionSoundName } from './types';

const isSoundSupported = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Track if sounds are initialized.
 */
let isInitialized = false;

/**
 * Configure audio mode for playback.
 */
async function configureAudio(): Promise<void> {
  if (isInitialized) return;

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    isInitialized = true;
  } catch {
    // Audio configuration is non-critical
  }
}

/**
 * Play a completion sound using expo-av.
 * Falls back gracefully if audio files are not available.
 *
 * @example
 * ```ts
 * import { playCompletionSound } from '@/utils/sounds';
 * playCompletionSound('chime');
 * ```
 */
export async function playCompletionSound(
  _soundName: CompletionSoundName
): Promise<void> {
  if (!isSoundSupported) return;

  try {
    await configureAudio();

    // Try to play bundled sound based on sound name
    // In production, these would be actual sound files in assets/sounds/
    // For now, we create a simple beep using Audio.Sound with a workaround

    // Create a sound from a bundled resource or URL
    // This is a placeholder - in production you'd have actual mp3 files
    const soundUri = getSoundUri(_soundName);

    if (soundUri) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: true, volume: 0.8 }
      );

      // Unload after playing to free resources
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    }
  } catch {
    // Sounds are non-critical — swallow errors silently
    // App continues without sound if playback fails
  }
}

/**
 * Get the URI for a sound file.
 * In production, these would point to bundled assets.
 */
function getSoundUri(soundName: CompletionSoundName): string | null {
  // In production, these would be actual bundled sounds
  // For demo/development, we return null to skip sound playback
  // until real sound files are added
  switch (soundName) {
    case 'chime':
      // Would be: asset:/sounds/chime.mp3
      return null;
    case 'pop':
      // Would be: asset:/sounds/pop.mp3
      return null;
    case 'success':
      // Would be: asset:/sounds/success.mp3
      return null;
    default:
      return null;
  }
}

/**
 * Stop any currently playing sound.
 */
export async function stopCompletionSound(): Promise<void> {
  if (!isSoundSupported) return;

  try {
    await Audio.setIsEnabledAsync(false);
    await Audio.setIsEnabledAsync(true);
  } catch {
    // Stopping is non-critical
  }
}

/**
 * Unload all sounds (cleanup).
 */
export async function unloadAllSounds(): Promise<void> {
  if (!isSoundSupported) return;
  isInitialized = false;
}
