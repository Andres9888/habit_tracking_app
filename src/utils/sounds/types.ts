/**
 * Sound Types
 *
 * Type definitions for completion sounds.
 *
 * Created by Opus.
 */

export type CompletionSoundName = 'chime' | 'pop' | 'success';

export interface SoundOptions {
  name: CompletionSoundName;
  label: string;
  description: string;
}

export const COMPLETION_SOUNDS: SoundOptions[] = [
  {
    name: 'chime',
    label: 'Gentle Chime',
    description: 'Soft, satisfying bell sound',
  },
  {
    name: 'pop',
    label: 'Pop',
    description: 'Quick, fun bubble pop',
  },
  {
    name: 'success',
    label: 'Success',
    description: 'Positive achievement tone',
  },
];
