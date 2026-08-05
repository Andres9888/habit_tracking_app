import type { OfflineSubmissionType } from '../../hooks/useOfflineQueue';
import { springs } from '@/theme/animations';

// Submission type display names
export const TYPE_LABELS: Record<OfflineSubmissionType, string> = {
  habitUpdate: 'Habit Updates',
};

// Animation constants
export const SPRING_CONFIG = springs.standard;
