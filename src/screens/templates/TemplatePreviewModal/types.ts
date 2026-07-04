/**
 * Type definitions for TemplatePreviewModal
 */

import type { ScrollView } from 'react-native';
import type { RefObject } from 'react';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { useTemplatePreview } from './useTemplatePreview';

type TemplatePreviewState = ReturnType<typeof useTemplatePreview>;

/** Customization options when importing a template */
export interface TemplateCustomizations {
  daysOfWeek?: number[];
  icon?: string;
  iconColor?: string;
  name?: string;
  preferredTime?: string;
  progressEmojis?: ProgressEmojiSet;
  reminderTime?: string;
  streakGoal?: number;
  strengthAlgorithm?: AlgorithmMode;
}

/** Props for the TemplatePreviewModal component */
export interface TemplatePreviewModalProps {
  importingTemplateId: Id<'templates'> | null;
  onClose: () => void;
  onImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => void;
  template: Doc<'templates'> | null;
  visible: boolean;
}

/** Props for the TemplatePreview sub-component */
export interface TemplatePreviewProps {
  customColor: string;
  description: string;
  icon: string;
}

/** Props for the NameInput sub-component */
export interface NameInputProps {
  customName: string;
  disabled: boolean;
  onChangeName: (name: string) => void;
}

/** Props for the ColorPicker sub-component */
export interface ColorPickerProps {
  customColor: string;
  disabled: boolean;
  onSelectColor: (color: string) => void;
}

/** Props for the ReminderTimePicker sub-component */
export interface ReminderTimePickerProps {
  disabled: boolean;
  onTimeChange: (time: Date) => void;
  reminderTime: Date;
  showTimePicker: boolean;
  onTogglePicker: (show: boolean) => void;
}

/** Props for the TemplateInfo sub-component */
export interface TemplateInfoProps {
  category: string;
  frequency: string;
}

/** Props for the ModalHeader sub-component */
export interface ModalHeaderProps {
  disabled: boolean;
  onClose: () => void;
}

/** Props for the ModalFooter sub-component */
export interface ModalFooterProps {
  customColor: string;
  disabled: boolean;
  isImporting: boolean;
  onImport: () => void;
}

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
