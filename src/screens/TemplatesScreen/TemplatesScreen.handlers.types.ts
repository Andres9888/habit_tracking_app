/**
 * Type definitions for TemplatesScreen handlers
 */

import type { FlatList } from 'react-native';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { TemplateToastData } from '../../components/TemplateAddedToast';
import type { Category, SortOption } from '../templates/constants';
import type {
  TemplateCustomizations,
  TemplatePreviewAnchor,
  ViewMode,
} from './TemplatesScreen.types';

export interface UseTemplateHandlersOptions {
  flatListRef: React.RefObject<FlatList<Doc<'templates'>> | null>;
  importTemplate: (args: {
    templateId: Id<'templates'>;
    customizations?: TemplateCustomizations;
  }) => Promise<{ success: boolean; habitId?: Id<'habits'> }>;
  isPremiumUser: boolean;
  onShowPaywall?: () => void;
  previewTemplate: Doc<'templates'> | null;
  /** Records the habit a template import produced, for "Go to Today". */
  recordImportedHabitId: (
    templateId: Id<'templates'>,
    habitId: Id<'habits'>
  ) => void;
  seedTemplates: (args: Record<string, never>) => Promise<unknown>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  setFeedbackHabitId: React.Dispatch<React.SetStateAction<Id<'habits'> | null>>;
  setFeedbackVariant: React.Dispatch<
    React.SetStateAction<'success' | 'already_exists' | null>
  >;
  setImportedTemplateIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportingTemplateId: React.Dispatch<
    React.SetStateAction<Id<'templates'> | null>
  >;
  setIsSeeding: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviewInitialAnchor: React.Dispatch<
    React.SetStateAction<TemplatePreviewAnchor>
  >;
  setPreviewTemplate: React.Dispatch<
    React.SetStateAction<Doc<'templates'> | null>
  >;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category>>;
  setSessionImportCount: React.Dispatch<React.SetStateAction<number>>;
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSortOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  userHabitCount: number;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
  setToastOnAction: React.Dispatch<React.SetStateAction<(() => void) | null>>;
  setToastTemplateData: React.Dispatch<
    React.SetStateAction<TemplateToastData | null>
  >;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}
