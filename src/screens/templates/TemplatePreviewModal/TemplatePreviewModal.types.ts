/**
 * Prop types for the TemplatePreviewModal sub-components
 */

import type { ScrollView } from 'react-native';
import type { RefObject } from 'react';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { useTemplatePreview } from './useTemplatePreview';

type TemplatePreviewState = ReturnType<typeof useTemplatePreview>;

/** Props for the PreviewSheetBody sub-component */
export interface PreviewSheetBodyProps {
  template: Doc<'templates'>;
  isImporting: boolean;
  paddingBottom: number;
  scrollViewRef: RefObject<ScrollView | null>;
  preview: TemplatePreviewState;
}

/** Props for the PreviewNameSection sub-component */
export interface PreviewNameSectionProps {
  template: Doc<'templates'>;
  isImporting: boolean;
  customColor: string;
  customIcon: string | null;
  customName: string;
  onChangeName: (name: string) => void;
}

/** Props for the CustomizationSections sub-component */
export interface CustomizationSectionsProps {
  template: Doc<'templates'>;
  customName: string;
  customColor: string;
  customIcon: string | null;
  showTimePicker: boolean;
  reminderTime: Date;
  strengthAlgorithm: AlgorithmMode;
  progressEmojis: ProgressEmojiSet | undefined;
  streakGoal: number;
  scrollToEnd: () => void;
  onIconSelect: (icon: string | null) => void;
  onColorSelect: (color: string) => void;
  onToggleTimePicker: (show: boolean) => void;
  onTimeChange: (time: Date) => void;
  onStrengthAlgorithmChange: (mode: AlgorithmMode) => void;
  onProgressEmojisChange: (next: ProgressEmojiSet | undefined) => void;
  onStreakGoalChange: (days: number) => void;
}
