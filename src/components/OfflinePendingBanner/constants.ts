import type { OfflineSubmissionType } from '../../hooks/useOfflineQueue';
import { springs } from '@/theme/animations';

// Submission type display names
export const TYPE_LABELS: Record<OfflineSubmissionType, string> = {
  affirmation: 'Affirmations',
  habitUpdate: 'Habit Updates',
  letter: 'Letters',
  reflection: 'Reflections',
  visionBoardImage: 'Images',
  voiceNote: 'Voice Notes',
};

// Animation constants
export const SPRING_CONFIG = springs.standard;
