/**
 * FeedbackModal Types
 *
 * Provides structured feedback collection with categories
 */

export type FeedbackType = 'bug' | 'feature' | 'general';

export interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  description: string;
  email?: string;
}
